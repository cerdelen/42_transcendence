import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { getInitialState, gameLoop} from './make_game_state'
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Logger } from '@nestjs/common';



const logger = new Logger('App');

interface KeyInfo
{
    key: number,
    player_number: number;
    socket_id: string;
    gameActive: boolean;
    game_id: number;
}
import pong_properties from './make_game_state'


interface game_array_properties
{
  game_instance: pong_properties,

  socket_id_1: string,
  socket_id_2: string,
  gameId: number,
}



let gameArray : game_array_properties [] = [];

function getIndex(id: number)
{
  for(let i = 0; i < gameArray.length; i++)
  {
    if(gameArray[i].gameId == id)
    {
      return i;
    }
  }
  return -1;
}
interface IQuene<T>
{ 
  enquene(item: T): void;
  dequene() : T | undefined;
  size() : number;
}

interface IuserInQuene
{
  id: number,
  socket_id: string,
  username: string,
  socket: Socket,
}

class Quene<T> implements IQuene<IuserInQuene>
{
  private storage: IuserInQuene[] = [];
  constructor(private capacity: number = Infinity){}

  enquene(item: IuserInQuene): void {
    if(this.size() === this.capacity)
    {
      throw Error("Max cap reached");
    }
    this.storage.push(item);
  }

  dequene(): IuserInQuene | undefined{
      return this.storage.shift();
  }

  size() : number{
    return this.storage.length;
  }

  check_if_is_in_quene(user_id : number) : boolean
  {
    for(let i = 0; i < this.storage.length; i++)
    {
      if(user_id == this.storage[i].id)
      {
        return true;
      }
    }

    return false;
  }

}

let main_quene : Quene<IuserInQuene> = new Quene<IuserInQuene>();

async function emitToTheUserSocket(user: any, server: Server, event_name:string, message: string)
{
  const sockets = await server.fetchSockets();
  let final_socket : any = {}; 
  let found : boolean = false;
  sockets.forEach( (e)  => 
  {
    if(e.id === user.socketId)
    {
      final_socket = e;
      found = true;
    }
  });
  if(!found)
  {
    return ;
  }
  if(event_name == 'gameCancelled')
  {
    console.log("emitting cancelled ");
  }
  final_socket.emit(event_name, message)
}
@WebSocketGateway(
  {
    cors: {
      origin: '*',
    },
  }
)

export class GameGateway implements OnGatewayConnection{
  @WebSocketServer()
  server: Server;

	handleConnection(client: any, ...args: any[])
	{
		client.setMaxListeners(20);
	}

  onModuleInit() {
			console.log("created this game gateway");
			this.server.sockets.setMaxListeners(20);
  }

  constructor(private readonly gameService: GameService, private prisma: PrismaService, private userService: UserService) {}

  @SubscribeMessage("setupUserSocketId")
  async setupUserSocketId(@MessageBody() userId: string,
  @ConnectedSocket() socket)
  {
    console.log("This is what user id data i got " , userId);
    if(!Number.parseInt(userId))
    {

      console.log("socket id setting up error ", Number.parseInt(userId));
      return ;
    }
    await this.userService.updateUser({where: {id: Number.parseInt(userId)}, data: {socketId: socket.id}} );
    console.log("Socket id of the user " + await this.userService.get_user_socket_id(Number.parseInt(userId)));
  }
  @SubscribeMessage("online_inform")
  async handle_online(@MessageBody() userId: string) {

  }
  
  @SubscribeMessage('userOffline')
  async makeOnline(@MessageBody() userId: string) {

  }
  @SubscribeMessage('remove_from_quene')
  async removeFromQuene(@MessageBody() userId, @ConnectedSocket() client)
  {

  }

//tldr Rooms
  @SubscribeMessage('playerAccepted')
  async playerAccepted(@MessageBody() obj, @ConnectedSocket() client)
  {
    interface obj_type
    {
      inviterName: string,
      userId: number,
    }

    let converted_obj : obj_type = JSON.parse(obj);
    let player_1 = await this.userService.findUserByName(converted_obj.inviterName);
    let player_2 = await this.userService.findUserById(converted_obj.userId);
    if(!player_1 || !player_2)
    {
      console.log("Error accesing users data");
      return ;
    }
    const player_1_socket = this.server.sockets.sockets.get(player_1.socketId);
    const player_2_socket = this.server.sockets.sockets.get(player_2.socketId);
    if(!player_1_socket || !player_2_socket)
    {
      console.log("Getting sockets problem");
      return ;
    }
    //create game Instance add it into game Array and start it
    let game_var = getInitialState();
    game_var.player_1_nick = player_1.name;
    game_var.player_2_nick = player_2.name;

    //create room and create database entry for the game

    
    const game_database_instance = await this.prisma.game.create({ data: { player_one: player_1.id, player_two: player_2.id } });
    if(!game_database_instance)
    {
      console.log("Game database instance problem");
      return; 
    }
    game_var.id = game_database_instance.id;
    player_1_socket.emit("invitationInit", 1);
    player_2_socket.emit("invitationInit", 2);

    player_1_socket.join(String(game_database_instance.id));
    player_2_socket.join(String(game_database_instance.id));
    let gameObj = {game_instance: game_var, socket_id_1: player_1.socketId, 
      socket_id_2: player_2.socketId, gameId: game_database_instance.id}

    gameArray.push(gameObj);
    const interval_id = setInterval(() => 
    {
      const winner : number = gameLoop(game_var);
      if(!winner)
      {
        emitGameState(String(game_database_instance.id), game_var, this.server);
      }else{
        if(winner == 2)
        {
          console.log("Emit game_over, p1");
          this.server.sockets.in(String(game_database_instance.id)).emit(
            'gameOver', game_database_instance.player_one);
          game_database_instance.winner = game_database_instance.player_one;
          game_database_instance.loser = game_database_instance.player_two;
        }else{
          console.log("Emit game_over, p2");
          this.server.sockets.in(String(game_database_instance.id)).emit(
            'gameOver', game_database_instance.player_two);
          game_database_instance.winner = game_database_instance.player_two;
          game_database_instance.loser = game_database_instance.player_one;
        }
        this.server.sockets.socketsLeave(String(game_database_instance.id));
        game_database_instance.score_one = game_var.player_1_score;
        game_database_instance.score_two = game_var.player_2_score;
        game_database_instance.finished = true;
        gameArray.splice(gameArray.indexOf(gameObj), 1);
        clearInterval(interval_id);
      }
    }, 1000 / 50);
    await this.prisma.game.update({
      where: { id: game_database_instance.id },

      data: { 
      winner: game_database_instance.winner,
      loser: game_database_instance.loser,
      score_one: game_database_instance.score_one,
      score_two: game_database_instance.score_two,
      finished: true,
      }
    });
    this.userService.add_game_to_history(game_database_instance.id);
  }






  @SubscribeMessage("user_in_quene")
  async user_in_quene_reject(@MessageBody() invitingUserName, @ConnectedSocket() socket)
  {

  }


  @SubscribeMessage('rejectInvite')
  async rejectInvitation(@MessageBody() obj, @ConnectedSocket() socket)
  {
    interface obj_type
    {
      inviterName: string,
      userId: number,
    }

    let converted_obj : obj_type = JSON.parse(obj);

    let invitingUser = await this.userService.findUserByName(converted_obj.inviterName);

    console.log("invite rejected");
    const invitedUserSocket = this.server.sockets.sockets.get(invitingUser.socketId);
    if(!invitedUserSocket)
    {
      console.log("Inviting user error");
      return ;
    }
    let invitedUser = await this.userService.findUserById(converted_obj.userId);
    if(!invitedUser)
    {
      console.log("invited user creation  error");
      return ;
    }
    invitedUserSocket.emit("gameCancelled", invitedUser.name);
  }
  
  @SubscribeMessage('createInvitationRoom')
  async handleInvitation(@MessageBody() obj, @ConnectedSocket() client)
  {
    console.log("creating invitation room");
    interface obj_type{
      userId: number,
      userName: string,
    } 
    let converted_obj : obj_type = JSON.parse(obj);
    console.log(converted_obj.userId , " + ", converted_obj.userName);
    //check if invited user is already in the game
    let invitedUser = await this.userService.findUserByName(converted_obj.userName);
    if(!invitedUser)
    {
      console.log("Database user error");
      return ;
    }
    if(main_quene.check_if_is_in_quene(invitedUser.id))
    {
      console.log("User is already in the quene cannot invite");
      client.emit("gameCancelled", invitedUser.name);
      return ;
    };
    //check if user is in the game
    for(let i = 0; i < gameArray.length; i++)
    {
      if(gameArray[i].socket_id_1 == invitedUser.socketId || gameArray[i].socket_id_2 == invitedUser.socketId)
      {
        console.log("User is already in the game cannot invite");
        client.emit("gameCancelled", invitedUser.name);
        return ;
      }
    }
    //If user is free send an invite to the user
    let invitingUser = await this.userService.findUserById(converted_obj.userId);
    if(!invitedUser)
    {
      console.log("getting invitng user failed");
      return ;
    }
    const invitedUserSocket = this.server.sockets.sockets.get(invitedUser.socketId);
    if(!invitedUserSocket)
    {

      console.log("Cannot find invited user socket");
      client.emit("gameCancelled", invitedUser.name);
      return ;
    }
    invitedUserSocket.emit("invitationPopUp", invitingUser.name);
  }

  
  @SubscribeMessage('joinGame')
  async joinGame(@MessageBody() userId: string,
  @ConnectedSocket() client) 
  {
    console.log(Number.parseInt(userId));
    if(!Number.parseInt(userId))
    {
      console.log("Wrong user id provided");
      return ;
    }


    let user_that_joins = await this.userService.findUserById(Number.parseInt(userId));
    if(!user_that_joins)
    {
      console.log("database call failed");
      return ;
    }

    let user_in_quene_object : IuserInQuene = {id : user_that_joins.id , socket_id: client.id, username: user_that_joins.name, socket: client};

    if(main_quene.check_if_is_in_quene(user_in_quene_object.id))
    {
      console.log("User is already in quene ");
      return ;
    }

    //if there is nothing in the quene add user to the quene 
    if(main_quene.size() == 0)
    {
      main_quene.enquene(user_in_quene_object);
      return ;
    }


    //If there is already one user in the quene
    //add user to the quene and start the game
    main_quene.enquene(user_in_quene_object);

    let player_1 = main_quene.dequene();
    let player_2 = main_quene.dequene();

    let game_var = getInitialState();
    game_var.player_1_nick = player_1.username;
    game_var.player_2_nick = player_2.username;

    //create room and create database entry for the game

    
    const game_database_instance = await this.prisma.game.create({ data: { player_one: player_1.id, player_two: player_2.id } });
    if(!game_database_instance)
    {
      console.log("Game database instance problem");
      return; 
    }
    game_var.id = game_database_instance.id;
    player_1.socket.emit("init", 1);
    player_2.socket.emit("init", 2);

    player_1.socket.join(String(game_database_instance.id));
    player_2.socket.join(String(game_database_instance.id));
    let gameObj = {game_instance: game_var, socket_id_1: player_1.socket_id, 
      socket_id_2: player_2.socket_id, gameId: game_database_instance.id}

    gameArray.push(gameObj);
    console.log("Starting interval");
    const interval_id = setInterval(() => 
    {
      const winner : number = gameLoop(game_var);
      if(!winner)
      {
        emitGameState(String(game_database_instance.id), game_var, this.server);
      }else{
        if(winner == 2)
        {
          console.log("Emit game_over, p1");
          this.server.sockets.in(String(game_database_instance.id)).emit(
            'gameOver', game_database_instance.player_one);
          game_database_instance.winner = game_database_instance.player_one;
          game_database_instance.loser = game_database_instance.player_two;
        }else{
          console.log("Emit game_over, p2");
          this.server.sockets.in(String(game_database_instance.id)).emit(
            'gameOver', game_database_instance.player_two);
          game_database_instance.winner = game_database_instance.player_two;
          game_database_instance.loser = game_database_instance.player_one;
        }
        this.server.sockets.socketsLeave(String(game_database_instance.id));
        game_database_instance.score_one = game_var.player_1_score;
        game_database_instance.score_two = game_var.player_2_score;
        game_database_instance.finished = true;
        gameArray.splice(gameArray.indexOf(gameObj), 1);
        clearInterval(interval_id);
      }
    }, 1000 / 50);
    await this.prisma.game.update({
      where: { id: game_database_instance.id },

      data: { 
      winner: game_database_instance.winner,
      loser: game_database_instance.loser,
      score_one: game_database_instance.score_one,
      score_two: game_database_instance.score_two,
      finished: true,
      }
    });
    this.userService.add_game_to_history(game_database_instance.id);
  }

 
  @SubscribeMessage('keydown')
  handleKeyDown(@MessageBody() keyobj,
    @ConnectedSocket() client) {
    let obj : KeyInfo = JSON.parse(keyobj);

    let index = getIndex(obj.game_id);
    if(index == -1)
    {
      return ;
    }
    if (obj.player_number == 1 && obj.socket_id == gameArray[index].socket_id_1) {
        gameArray[index].game_instance.keysPressed_p1[obj.key] = true;


    } else if (obj.player_number == 2 && obj.socket_id == gameArray[index].socket_id_2) {
        gameArray[index].game_instance.keysPressed_p2[obj.key] = true;
    }

  }
  @SubscribeMessage('keyup')
  handleKeyUp(@MessageBody() keyobj,
    @ConnectedSocket() client) {

      let obj : KeyInfo = JSON.parse(keyobj);
      let index = getIndex(obj.game_id);
      if(index == -1)
        return ;
      if (obj.player_number == 1 &&  obj.socket_id == gameArray[index].socket_id_1) {
          gameArray[index].game_instance.keysPressed_p1[obj.key] = false;
      } else if (obj.player_number == 2 && obj.socket_id == gameArray[index].socket_id_2) {
          gameArray[index].game_instance.keysPressed_p2[obj.key] = false;
      }
    }
}

function emitGameState(roomName: string, state_: any, server: Server) {
    // logger.debug('emitgamestate');
    server.sockets.in(roomName).emit('gameState', JSON.stringify(state_));
}
// async function startGameInterval(userService: any, roomName: string, state_: any, server: Server, game: any, prisma: PrismaService) {
  //     logger.debug('stargameInterval');
  //     let other_game = await prisma.game.findUnique({ where: { id: game.id } });
  //   // console.log("start game ", other_game);
  
  //   const intervalId = setInterval(() => {
    //     const winner: number = gameLoop(state_);
    //     if (!winner) {
      //       emitGameState(roomName, state_, server);
      //     } else {
        //       emitGameOver(state_ ,userService, roomName, winner, server, game, prisma, other_game.player_two);
        //       // //console.log("breaks here ? ");
        //       if(stateArr[roomName])
        //       if(stateArr[roomName].participants)
        //       {
          //         console.log("Here");
          //         clientRooms[stateArr[roomName].participants[0]] = null;
          //         clientRooms[stateArr[roomName].participants[1]] = null;
          //         console.log("Here!  ")
          //       }
          
          //       stateArr[roomName] = null;
          //       clearInterval(intervalId);
          //     }
          //   }, 1000 / 50);
          // }
          
          // async function handleNewGame(client: any, server: Server, user: any, clientId: number, prisma: PrismaService) {
          //   logger.debug('handleNewGame');
          //   const game = await prisma.game.create({ data: { player_one: clientId } });
          // }
          
          function makeid(length: number) {
            let result: string = '';
            let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength: number = characters.length;
            for (let i = 0; i < length; i++) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
          }
            // async function emitGameOver(state_: any, userService: any, roomName: string, winner: number, server: Server, game: any, prisma: PrismaService, player_two: number) {
            
            //   if (winner == 2) {
            //     console.log("Room name", roomName);
            //     server.sockets.in(roomName).emit('gameOver', Number.parseInt(game.player_one));
            //     game.winner = game.player_one;
            //     game.loser = player_two;
            //     server.sockets.socketsLeave(roomName);
            //   } else {
            //     console.log("Room name", roomName);
            //     game.winner = player_two;
            //     game.loser = game.player_one;
            //     server.sockets.in(roomName).emit('gameOver', (Number.parseInt(game.player_two)));
            //     server.sockets.socketsLeave(roomName);
            //   }
            //   if (!game.score_one) {
            //     game.score_one = state_.player_1_score;
            //     game.score_two = state_.player_2_score;
            //     game.finished = true;
            //     await prisma.game.update({
            //       where: { id: game.id },
            //       data: {
            //         winner: game.winner,
            //         loser: game.loser,
            //         score_one: game.score_one,
            //         score_two: game.score_two,
            //         finished: true,
            //       }
            //     });
            //     userService.add_game_to_history(game.id);
            //   }
            // }