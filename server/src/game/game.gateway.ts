import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket as socket_io } from 'socket.io';
import { getInitialState, gameLoop} from './make_game_state'
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
// import {roomNames,
// invitationRooms,
// invitationRoomsNames,
// KeyInfo,
// invitesType,
// invites,
// state_type,
// stateArr,
// clientRooms,} from "./GameTypes"
// let gameCode: string = "";

import { Logger } from '@nestjs/common';

const logger = new Logger('App');


logger.debug('\x1b[41m\x1b[37m%s\x1b[0m', 'Hello, World!');
import pong_properties from './make_game_state'
export let roomNames: { roomName: string, gameInstance: any }[] = [];
export let invitationRooms = {};
export let invitationRoomsNames : { roomName: string, gameInstance: any}[] = [];
export interface KeyInfo
{
    key: number,
    player_number: number;
    socket_id: string;
    gameActive: boolean;
}
export interface invitesType
{
  creator_id: string;
  invitee_id: string;
};
export let invites : invitesType[] = [];
export interface state_type
{
  participants : string[],
  state : pong_properties,
}
export const stateArr : state_type[] = [];
export const inviteState = {};
export const clientRooms = {};
let gameCode: string = "";

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
      // if(event_name == 'gameCancelled')
        //console.log("Kurwa jebana mać");
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
    if (Number.parseInt(userId)) {
      this.userService.set_user_online(Number.parseInt(userId) ,true);
      //console.log("userOnline", userId);
    }
  }
  
  @SubscribeMessage('userOffline')
  async makeOnline(@MessageBody() userId: string) {
    //console.log("UserOffline", userId);
    if(!Number.parseInt(userId))
    {
      return ;
    }
    this.userService.set_user_online(Number.parseInt(userId) ,false);
    
  }
  @SubscribeMessage('remove_from_quene')
  async removeFromQuene(@MessageBody() userId, @ConnectedSocket() client)
  {
    logger.debug('remove_from_quene');
    let game_id;
    game_id = clientRooms[client.id]
    // if(invitationRooms[client.id])
    // {
    //   invitationRooms[client.id] = null;
    //   stateArr[game_id].participants[0] = String(client.id);
    //   roomNames.pop();
    //   clientRooms[client.id] = null;
    //   console.log("Removed");
    //   return ;
    // }
    if(!game_id || !stateArr[game_id])
    {
      return ;
    }
    stateArr[game_id].participants[0] = String(client.id);
    roomNames.pop();
    clientRooms[client.id] = null;
    console.log("Removed");
  }
  // @SubscribeMessage('player_disconnected')
  // async disconnectFromGame(@MessageBody() userId, @ConnectedSocket() client)
  // {
  //   client.emit("gameOver", 2);

  //   let gameCode = invitationRooms[client.id]
  //   // this.server.sockets.
  //   client.leave(gameCode);
  //   console.log("disconnect ran");
  // }

//tldr Rooms
  @SubscribeMessage('playerAccepted')
  async playerAccepted(@MessageBody() obj, @ConnectedSocket() client)
  {
    logger.debug('playerAccepted');
    console.log(JSON.stringify(obj));
    let parsed_obj = JSON.parse(obj);
    if(clientRooms[client.id])
    {
      let game_id;
      game_id = clientRooms[client.id]
      if(!game_id || !stateArr[game_id])
      {
        return ;
      }
      stateArr[game_id].participants[0] = String(client.id);
      roomNames.pop();
      clientRooms[client.id] = null;
    }
    let invitor = await this.userService.findUserByName(parsed_obj.inviterName);
    // let new_invitation_obj : invitesType = {creator_id: String(.id), invitee_id: new_obj.userId};


    // if(!(clientRooms[client.id] == undefined) || !(clientRooms[client.id] == null))
    if(!(clientRooms[invitor.socketId] == undefined) || !(clientRooms[invitor.socketId] == null))
    {
      console.log("the undefined or null if " + JSON.stringify(clientRooms));
      // let new_obj = JSON.parse(obj);
      // let user = await this.userService.findUserByName(new_obj.inviterName);
      let new_invitation_obj : invitesType = {creator_id: String(invitor.id), invitee_id: parsed_obj.userId};
      let delindex = invites.indexOf(new_invitation_obj);
      if(!delindex)
      {
        ////console.log("Index to delete not found in reject invite ");
        return ;
      }
      invites.splice(delindex, 1);
      console.log("find 1");
      let new_user = await this.userService.findUserById(Number.parseInt(parsed_obj.userId));
      ////console.log("Game cancelled event sent");
      emitToTheUserSocket(invitor, this.server, "gameCancelled", new_user.name)
      return ;
    }

//delete the "game the other invited player was in the queue in"
// findRoomnames by player_one (backend id)

    for (let index = 0; index < roomNames.length; index++) {
      const element = roomNames[index];
      if (element.gameInstance.player_one == parsed_obj.userId)
      {
        roomNames.splice(index, 1);
        break ;
      }
    }

    //find state arr obj by participants (socket id of invited player)

    // for (let index = 0; index < stateArr.length; index++) {
    //   const element = stateArr[index];
    //   if (element.participants.includes(client.id))
    //   {
    //     stateArr.splice(index, 1);
    //     break;
    //   }
    // }


    // find clientrooms (socket id of invited player)
    // for (let index = 0; index < clientRooms.length; index++) {
    //   const element = array[index];
      
    // }
    if (clientRooms.hasOwnProperty(client.id)) {
      delete clientRooms[client.id];
    }

    console.log("find 2");
    let user = await this.userService.findUserById(Number.parseInt(parsed_obj.userId))
    let gameCode_;
    gameCode_ = invitationRoomsNames[0].roomName;
    const room = this.server.sockets.adapter.rooms[gameCode_];
    let numOfClients = 0;
    const sockets = await this.server.in(gameCode_).fetchSockets();
    numOfClients = sockets.length;
    let user_1 = await this.userService.findUserByName(parsed_obj.inviterName);
    let new_invitation_obj : invitesType = {creator_id: String(user_1.id), invitee_id: parsed_obj.userId};
    let delindex = invites.indexOf(new_invitation_obj);
    if(!delindex)
    {
      return ;
    }
    invites.splice(delindex, 1);
    invitationRooms[client.id] = String(gameCode_);
    stateArr[gameCode_].participants[1] = client.id;
    client.join(gameCode_);
    emitToTheUserSocket(user, this.server, 'invitationInit', "2");
    await this.prisma.game.update({ where: { id: invitationRoomsNames[0].gameInstance.id }, data: { player_two: user.id } });
    let gameInstance = invitationRoomsNames[0].gameInstance;
    stateArr[gameCode_].state.player_2_nick = user.name;
    startGameInterval(this.userService, gameCode_, stateArr[gameCode_].state, this.server, gameInstance, this.prisma);
    invitationRoomsNames.shift();
  }





  @SubscribeMessage("user_in_quene")
  async user_in_quene_reject(@MessageBody() invitingUserName, @ConnectedSocket() socket)
  {
    let user = await this.userService.findUserByName(invitingUserName);


  }


  @SubscribeMessage('rejectInvite')
  async rejectInvitation(@MessageBody() obj, @ConnectedSocket() socket)
  {
    logger.debug('rejectInvitation');
    let new_obj = JSON.parse(obj);

    let user = await this.userService.findUserByName(new_obj.inviterName);
    let new_invitation_obj : invitesType = {creator_id: String(user.id), invitee_id: new_obj.userId};
    let delindex = invites.indexOf(new_invitation_obj);
    if(!delindex)
    {
      return ;
    }
    // this.server.sockets.in(invitationRooms[invites[delindex].creator_id]).disconnectSockets(true);
    invites.splice(delindex, 1);
    console.log("find 3");
    let new_user = await this.userService.findUserById(Number.parseInt(new_obj.userId));
    emitToTheUserSocket(user, this.server, "gameCancelled", new_user.name)
  }
  
  @SubscribeMessage('createInvitationRoom')
  async handleInvitation(@MessageBody() obj, @ConnectedSocket() client)
  {
    logger.debug('handleInvitation');
    let object = JSON.parse(obj);
    let userId = object.userId;       //invitor
    if(!userId)
    {
      console.log("Something broken 0");
      return ;
    }
    let invitedUserId = object.userName;  //Invited
    
    //console.log("Wha the shell -1");
    let user = await this.userService.findUserByName(invitedUserId);        //user == invited
    console.log("user ", userId , " invited " , invitedUserId, " is ", user.socketId);
    if(user.online == false)
    {
      console.log("User is offline");
      client.emit("invitedUserIsOffline");
      return ;
    }

    let unique : boolean = true;
    let new_invitation_obj : invitesType = {creator_id: userId, invitee_id: String(user.id)};
    invites.forEach((entry) => {
      if(entry.creator_id == userId && entry.invitee_id == String(user.id) || entry.creator_id == String(user.id)  && entry.invitee_id  == userId)
      {
        unique = false;
      }
    });
    if (unique)
      invites.push(new_invitation_obj);
    
    
      const game = await this.prisma.game.create({ data: { player_one: Number.parseInt(userId) } });
      invitationRooms[client.id] = game.id.toString();
      console.log("Inviting 1");
      client.emit('gameCode', game.id.toString());
      let pair : state_type = {participants: [], state: getInitialState()};
      stateArr[game.id] = pair;
      stateArr[game.id].participants[0] = client.id;
      
      client.join(game.id.toString());
      console.log("Inviting 2");
      client.emit('invitationInit', 1);
      invitationRoomsNames.push({ roomName: game.id.toString(), gameInstance: game });

      let creator_id = await this.userService.find_user_by_sock_id(client.id);
      if (creator_id == undefined)
      {
        console.log("Creator id broken");
        return ;
      }
      console.log("find 4");
      let creator = await this.userService.findUserById(creator_id);
      if(creator == undefined)
      {
        console.log("Creator not created");
        return ;
      }
      console.log("Inviting 3");
      console.log("user socket id", user.socketId);
  
      emitToTheUserSocket(user, this.server, "invitationPopUp",creator.name)
      stateArr[game.id].state.player_1_nick = creator.name;
      return;
  }
  
  @SubscribeMessage('joinGame')
  async joinGame(@MessageBody() userId: string,
  @ConnectedSocket() client) {
    logger.debug('joinGame');
    if (!userId) {
      console.log("User id callback return");
      return;
    }
    if(!(clientRooms[client.id] == undefined) || !(clientRooms[client.id] == null))
    {
      console.log("game ongoing " );
      client.emit("gameOngoing");
      return ;
    }

    if (roomNames.length < 1) {
      console.log("new game Room created");
      console.log("client id ", client.id);
      let user_id = await this.userService.find_user_by_sock_id(client.id);
      console.log("find 5 " , user_id);
      if (Number.isNaN(Number(user_id)))
      {
        logger.debug('there is a big error here for somereason not a number');
        return;
      }
        
      let user = await this.userService.findUserById(user_id);
      handleNewGame(client, this.server, user  ,Number.parseInt(userId),this.prisma);
      return;
    }

    gameCode = roomNames[0].roomName;

    const room = this.server.sockets.adapter.rooms[gameCode];
    let numOfClients = 0;


    const sockets = await this.server.in(gameCode).fetchSockets();
    numOfClients = sockets.length;

    if (numOfClients === 0) { 
      console.log("co jest ", client.id);
      console.log("unknownGame");
      client.emit('unknownGame');
      return;
    } else if (numOfClients > 1) {
      console.log("num of clients is less than 1");
      client.emit('tooManyPlayers')
      return;
    }


    if (sockets[0].id === client.id || roomNames[0].gameInstance.player_one == userId) {
      console.log("Same user");
      client.emit('sameUser');
      return;
    };

    clientRooms[client.id] = gameCode;

    client.join(gameCode);
    client.emit('init', 2);
    if(!Number.parseInt(userId))
    {
      console.log("user id parsing error");
      return ;
    }
    // console.log("join Quene");
    // roomNames.forEach((e) => 
    // {
    //   console.log(e);
    // })
    stateArr[gameCode].participants[1] = String(client.id);
    await this.prisma.game.update({ where: { id: roomNames[0].gameInstance.id }, data: { player_two: Number.parseInt(userId) } });
    let gameInstance = roomNames[0].gameInstance;
    console.log("find 6");

    let user = await this.userService.findUserById(Number.parseInt(userId));
    stateArr[gameCode].state.player_2_nick = user.name;
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
    if(!pure_keyObj.gameActive)
    {
      return ;
    }
    if(keyobj.player_number === 0 || !stateArr[roomName])
    {
      //console.log("Player number not provided error");
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
    if(!pure_keyObj.gameActive)
    {
      return ;
    }
    if(pure_keyObj.player_number === 0 || !stateArr[roomName])
    {
      //console.log("Player number not provided error");
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
    logger.debug('emitgamestate');
    server.sockets.in(roomName).emit('gameState', JSON.stringify(state_));
}

async function emitGameOver(state_: any, userService: any, roomName: string, winner: number, server: Server, game: any, prisma: PrismaService, player_two: number) {

  if (winner == 2) {
    console.log("Room name", roomName);
    server.sockets.in(roomName).emit('gameOver', Number.parseInt(game.player_one));
    game.winner = game.player_one;
    game.loser = player_two;
    server.sockets.socketsLeave(roomName);
  } else {
    console.log("Room name", roomName);
    game.winner = player_two;
    game.loser = game.player_one;
    server.sockets.in(roomName).emit('gameOver', (Number.parseInt(game.player_two)));
    server.sockets.socketsLeave(roomName);
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
    logger.debug('stargameInterval');
    let other_game = await prisma.game.findUnique({ where: { id: game.id } });
  // console.log("start game ", other_game);
  
  const intervalId = setInterval(() => {
    const winner: number = gameLoop(state_);
    if (!winner) {
      emitGameState(roomName, state_, server);
    } else {
      emitGameOver(state_ ,userService, roomName, winner, server, game, prisma, other_game.player_two);
      // //console.log("breaks here ? ");
      if(stateArr[roomName])
      if(stateArr[roomName].participants)
      {
        console.log("Here");
        clientRooms[stateArr[roomName].participants[0]] = null;
        clientRooms[stateArr[roomName].participants[1]] = null;
        console.log("Here!  ")
      }

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
async function handleNewGame(client: any, server: Server, user: any, clientId: number, prisma: PrismaService) {
    logger.debug('handleNewGame');
    if(!clientId)
  {
    console.log("client id breaking stuff");
    return ;
  }

  const game = await prisma.game.create({ data: { player_one: clientId } });

  clientRooms[client.id] = game.id.toString();
  client.emit('gameCode', game.id.toString());
  let pair : state_type = {participants: [], state: getInitialState()};  
  stateArr[game.id] = pair;
  stateArr[game.id].participants[0] = String(client.id);
  client.join(game.id.toString());
  stateArr[game.id].state.player_1_nick = user.name;
  client.emit('init', 1);
  roomNames.push({ roomName: game.id.toString(), gameInstance: game });





  console.log("roomNames", roomNames)
  console.log("invitationroosm", invitationRooms)
  console.log("invitationroosmnames", invitationRoomsNames)
  console.log("statearr", stateArr)
  console.log("invitastate", inviteState)
  console.log("clientrooms", clientRooms)
}