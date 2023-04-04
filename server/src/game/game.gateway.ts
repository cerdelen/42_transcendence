import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket as socket_io } from 'socket.io';
import { getInitialState, gameLoop} from './make_game_state'
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { io_server } from 'src/utils/Server';
import { interval } from 'rxjs';
import { Socket } from 'dgram';
import { emit } from 'process';
import pong_properties from './make_game_state'


let roomNames: { roomName: string, gameInstance: any }[] = [];

let invitationRooms = {};
let invitationRoomsNames : { roomName: string, gameInstance: any}[] = [];
interface KeyInfo
{
    key: number,
    player_number: number;
    socket_id: string;
}
interface invitesType
{
  creator_id: string;
  invitee_id: string;
};
let invites : invitesType[] = [];

interface state_type
{
  participants : string[],
  state : pong_properties,
}
const stateArr : state_type[] = [];

const inviteState = {};
const clientRooms = {};
let gameCode: string = "";


let response: number = 0;


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
  final_socket.emit(event_name, message)
}

@WebSocketGateway(
  {
    cors: {
      origin: '*',
    },
  }
)

export class GameGateway {
  @WebSocketServer()
  server: Server;

  // onModuleInit() {
  //   this.server.on('connection', (socket) => {
  //     //console.log(socket.id);
  //     //console.log("connected");
  //     setInterval(() => {
  //       socket.emit("online_check");
  //       if (response === 0) {
  //         //socket.id switch user offline with userID
  //         // //console.log("Is offline");
  //       }
  //       response = 0;
  //     }, 10000)
  //   })
  // }

  constructor(private readonly gameService: GameService, private prisma: PrismaService, private userService: UserService) {
  }

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
    //console.log("Socket id of the user " + await this.userService.get_user_socket_id(Number.parseInt(userId)));
  }
  @SubscribeMessage("online_inform")
  async handle_online(@MessageBody() userId: string) {
    if (Number.parseInt(userId)) {
      this.userService.set_user_online(Number.parseInt(userId) ,true);
      console.log("userOnline", userId);
    }
  }
  @SubscribeMessage('userOffline')
  async makeOnline(@MessageBody() userId: string) {
    console.log("UserOffline", userId);
    if(!Number.parseInt(userId))
    {
      return ;
    }
    this.userService.set_user_online(Number.parseInt(userId) ,false);
    
  }

  @SubscribeMessage('playerAccepted')
  async playerAccepted(@MessageBody() obj, @ConnectedSocket() client)
  {
    if(!(clientRooms[client.id] == undefined) || !(clientRooms[client.id] == null))
    {
      let new_obj = JSON.parse(obj);

      let user = await this.userService.findUserByName(new_obj.inviterName);
      let new_invitation_obj : invitesType = {creator_id: String(user.id), invitee_id: new_obj.userId};
      let delindex = invites.indexOf(new_invitation_obj);
      if(!delindex)
      {
        //console.log("Index to delete not found in reject invite ");
        return ;
      }
      invites.splice(delindex, 1);
      let new_user = await this.userService.findUserById(new_obj.userId);
      //console.log("Game cancelled event sent");
      emitToTheUserSocket(user, this.server, "gameCancelled", new_user.name)
      return ;
    }
    let new_obj = JSON.parse(obj);
    //console.log("USer id of the inviter "  + new_obj.inviterName + "and of the invitee " + new_obj.userId);
    let user = await this.userService.findUserById(Number.parseInt(new_obj.userId))
    //console.log("after finding work");
    let gameCode_;
    gameCode_ = invitationRoomsNames[0].roomName;
    
    const room = this.server.sockets.adapter.rooms[gameCode_];

    let allUsers;

    if (room) {
      allUsers = room.sockets;
    }
    let numOfClients = 0;

    const sockets = await this.server.in(gameCode_).fetchSockets();
    numOfClients = sockets.length;

    // if (numOfClients === 0) {
    //   client.emit('unknownGame');
    //   return;
    // } else if (numOfClients > 1) {
    //   client.emit('tooManyPlayers')
    //   return;
    // }
    
    // if (sockets[0].id === client.id || invitationRoomsNames[0].gameInstance.player_one == user.id) {
    //   client.emit('sameUser');
    //   return;
    // };
    
    //console.log("Socket 0 id " + sockets[0].id + " client id " + client.id + " roomName ", gameCode_);
    invitationRooms[client.id] = String(gameCode_);
    stateArr[gameCode_].participants[1] = client.id;
    client.join(gameCode_);

    //console.log("User of nick ", user.name);
    emitToTheUserSocket(user, this.server, 'invitationInit', "2");
    
    // //console.log("this is client id " + user.id);
    await this.prisma.game.update({ where: { id: invitationRoomsNames[0].gameInstance.id }, data: { player_two: user.id } });
    let gameInstance = invitationRoomsNames[0].gameInstance;
    
    startGameInterval(this.userService, gameCode_, stateArr[gameCode_].state, this.server, gameInstance, this.prisma);
    // //console.log("Ajajj");
    invitationRoomsNames.shift();
  }
  @SubscribeMessage('rejectInvite')
  async rejectInvitation(@MessageBody() obj, @ConnectedSocket() socket)
  {
    let new_obj = JSON.parse(obj);

    let user = await this.userService.findUserByName(new_obj.inviterName);
    let new_invitation_obj : invitesType = {creator_id: String(user.id), invitee_id: new_obj.userId};
    let delindex = invites.indexOf(new_invitation_obj);
    if(!delindex)
    {
      //console.log("Index to delete not found in reject invite ");
      return ;
    }
    invites.splice(delindex, 1);
    let new_user = await this.userService.findUserById(new_obj.userId);
    //console.log("Game cancelled event sent");
    emitToTheUserSocket(user, this.server, "gameCancelled", new_user.name)
  }
  
  @SubscribeMessage('createInvitationRoom')
  async handleInvitation(@MessageBody() obj , @ConnectedSocket() client)
  {
    if(!clientRooms)
    {
      return ;
    }
    if(!(clientRooms[client.id] == undefined) || !(clientRooms[client.id] == null))
    {
      console.log("game ongoing " );
      client.emit("gameOngoing");
      return ;
    }
    let object = JSON.parse(obj);
    let userId = object.userId;
    let invitedUserId = object.userName;
    let user = await this.userService.findUserByName(invitedUserId);
    let unique : boolean = true;

    if (!roomNames[0]) {
      let new_invitation_obj : invitesType = {creator_id: userId, invitee_id: String(user.id)};
     
      invites.forEach((entry) => {
        if(entry.creator_id == userId && entry.invitee_id == String(user.id) || entry.creator_id == String(user.id)  && entry.invitee_id  == userId)
        {
          unique = false;
        }
      });
      if(!unique)
      {
        //console.log("Invitation already exist");
        return ;
      }
      invites.push(new_invitation_obj);
      
      if(!userId)
      {
        return ;
      }
      const game = await this.prisma.game.create({ data: { player_one: Number.parseInt(userId) } });
      invitationRooms[client.id] = game.id.toString();
      client.emit('gameCode', game.id.toString());
      let pair : state_type = {participants: [], state: getInitialState()};

      stateArr[game.id] = pair;
      stateArr[game.id].participants[0] = client.id;
      client.join(game.id.toString());
    
      client.emit('invitationInit', 1);
      invitationRoomsNames.push({ roomName: game.id.toString(), gameInstance: game });

      let creator = await this.userService.findUserById(Number.parseInt(userId));
      emitToTheUserSocket(user, this.server, "invitationPopUp", creator.name)
      return;
    }
  }
  
  @SubscribeMessage('joinGame')
  async joinGame(@MessageBody() userId: string,
    @ConnectedSocket() client) {
    if (!userId) {
      return;
    }
    if(!(clientRooms[client.id] == undefined || clientRooms[client.id] == null))
    {
      console.log("game ongoing " );
      client.emit("gameOngoing");
      return ;
    }
    if (!roomNames[0]) {
      handleNewGame(client, this.server, Number.parseInt(userId), this.prisma);
      return;
    }
    gameCode = roomNames[0].roomName;

    const room = this.server.sockets.adapter.rooms[gameCode];

    let allUsers;

    if (room) {
      allUsers = room.sockets;
    }

    let numOfClients = 0;

    const sockets = await this.server.in(gameCode).fetchSockets();
    numOfClients = sockets.length;

    if (numOfClients === 0) {
      client.emit('unknownGame');
      return;
    } else if (numOfClients > 1) {
      client.emit('tooManyPlayers')
      return;
    }


    if (sockets[0].id === client.id || roomNames[0].gameInstance.player_one == userId) {
      client.emit('sameUser');
      return;
    };

    clientRooms[client.id] = gameCode;

    client.join(gameCode);
    client.emit('init', 2);
    if(!Number.parseInt(userId))
    {
      return ;
    }
    stateArr[gameCode].participants[1] = String(client.id);
    await this.prisma.game.update({ where: { id: roomNames[0].gameInstance.id }, data: { player_two: Number.parseInt(userId) } });
    let gameInstance = roomNames[0].gameInstance;
    startGameInterval(this.userService, gameCode, stateArr[gameCode].state, this.server, gameInstance, this.prisma);
    roomNames.shift();
  }

  @SubscribeMessage('keydown')
  handleKeyDown(@MessageBody() keyobj,
    @ConnectedSocket() client) {
    let roomName = clientRooms[client.id];
    
    if (!roomName) {
      roomName = invitationRooms[client.id];
      if(!roomName)
        return ;
    }
    let pure_keyObj : KeyInfo = JSON.parse(keyobj);
    if(keyobj.player_number === 0)
    {
      console.log("Player number not provided error");
      return ;  
    }


    if (pure_keyObj.player_number == 1 &&  pure_keyObj.socket_id == stateArr[roomName].participants[0]) {
      if (stateArr[roomName].state)
        stateArr[roomName].state.keysPressed_p1[pure_keyObj.key] = true;
    } else if (pure_keyObj.player_number == 2 && pure_keyObj.socket_id == stateArr[roomName].participants[1]) {
      if (stateArr[roomName].state)
        stateArr[roomName].state.keysPressed_p2[pure_keyObj.key] = true;
    }
  }

  @SubscribeMessage('keyup')
  handleKeyUp(@MessageBody() keyobj,
    @ConnectedSocket() client) {
    let roomName = clientRooms[client.id];

    if (!roomName) {
      roomName = invitationRooms[client.id];
      if(!roomName)
        return ;
    }

    let pure_keyObj : KeyInfo = JSON.parse(keyobj);
    if(pure_keyObj.player_number === 0)
    {
      console.log("Player number not provided error");
      return ;  
    }
    if (pure_keyObj.player_number == 1 && pure_keyObj.socket_id == stateArr[roomName].participants[0]) {
      if (stateArr[roomName].state) {
        stateArr[roomName].state.keysPressed_p1[pure_keyObj.key] = false;
      }
    } else if (pure_keyObj.player_number == 2 && pure_keyObj.socket_id == stateArr[roomName].participants[1]) {
      if (stateArr[roomName].state) {
        stateArr[roomName].state.keysPressed_p2[pure_keyObj.key] = false;
      }
    }
  }
}


function emitGameState(roomName: string, state_: any, server: Server) {
  server.sockets.in(roomName).emit('gameState', JSON.stringify(state_));

}

async function emitGameOver(state_: any, userService: any, roomName: string, winner: number, server: Server, game: any, prisma: PrismaService, player_two: number) {

  if (winner == 1) {
    server.sockets.in(roomName).emit('gameOver', Number.parseInt(game.player_one));
    game.winner = game.player_one;
    game.loser = player_two;
  } else {
    game.winner = player_two;
    game.loser = game.player_one;
    server.sockets.in(roomName).emit('gameOver', (Number.parseInt(game.player_two)));
  }
  if (!game.score_one) {
    game.score_one = state_.player_1_score;
    game.score_two = state_.player_2_score;
    game.finished = true;
    await prisma.game.update({
      where: { id: game.id },
      data: {
        winner: game.winner,
        loser: game.loser,
        score_one: game.score_one,
        score_two: game.score_two,
        finished: true,
      }
    });
    userService.add_game_to_history(game.id);
  }
}
async function startGameInterval(userService: any, roomName: string, state_: any, server: Server, game: any, prisma: PrismaService) {
  let other_game = await prisma.game.findUnique({ where: { id: game.id } });
  const intervalId = setInterval(() => {
    const winner: number = gameLoop(state_);
    if (!winner) {
      emitGameState(roomName, state_, server);
    } else {
      emitGameOver(state_ ,userService, roomName, winner, server, game, prisma, other_game.player_two);
      clientRooms[stateArr[roomName].participants[0]] = null;
      clientRooms[stateArr[roomName].participants[1]] = null;
      stateArr[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / 50);
}
function makeid(length: number) {
  let result: string = '';
  let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength: number = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
async function handleNewGame(client: any, server: Server, clientId: number, prisma: PrismaService) {
  if(!clientId)
  {
    return ;
  }
  const game = await prisma.game.create({ data: { player_one: clientId } });

  clientRooms[client.id] = game.id.toString();
  client.emit('gameCode', game.id.toString());
  let pair : state_type = {participants: [], state: getInitialState()};  
  stateArr[game.id] = pair;
  stateArr[game.id].participants[0] = String(client.id);
  client.join(game.id.toString());

  client.emit('init', 1);
  roomNames.push({ roomName: game.id.toString(), gameInstance: game });
}