import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket } from 'socket.io' //good
import { Server, Socket as socket_io } from 'socket.io';
import {getInitialState, gameLoop} from './make_game_state'
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
let readyPlayerCount : number = 0;
let roomNames : {roomName: string, gameInstance: any}[] = [];

let roomName : string = "";
const state = {};
const clientRooms = {};
let gameCode : string = "";
function emitGameState(roomName: string, state : any, server: Server)
{
  server.sockets.in(roomName).emit('gameState', JSON.stringify(state));

}

function emitGameOver(userService: any,roomName : string, winner: number, server: Server, game: any)
{
  // winner : 1
  // loser: 2
  if(winner == 1)
  {
    server.sockets.in(roomName).emit('gameOver', Number.parseInt(game.player_one));
    game.winner = game.player_one;
    game.loser = game.player_two;
  }else{

    game.winner = game.player_two;
    game.loser = game.player_one;
    server.sockets.in(roomName).emit('gameOver', Number.parseInt(game.player_two));
  }
  if(!game.score_one)
  {
    game.score_one = state[roomName].player_1_score;
    game.score_two = state[roomName].player_2_score;
    game.finished = true;
    userService.add_game_to_history(Number.parseInt(roomName));
  }

}
function startGameInterval(userService: any, roomName : string, state: any, server: Server, game :any)
{
  const intervalId = setInterval(() =>
  {
    const winner : number = gameLoop(state[roomName]);
    if(!winner)
    {
      emitGameState(roomName, state[roomName], server);
    }else{
      emitGameOver(userService ,roomName, winner, server, game);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / 50);
}
function makeid(length : number)
{
  let result : string           = '';
  let characters: string       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength : number = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
async function handleNewGame(client: any, server: Server, clientId: number, prisma: PrismaService)
{
  const game = await prisma.game.create({data: {player_one: clientId}});

  clientRooms[client.id] = game.id.toString();
  client.emit('gameCode', game.id.toString());
  state[game.id] = getInitialState();

  client.join(game.id.toString());

  client.emit('init', 1);
  roomNames.push({roomName: game.id.toString(),gameInstance: game});
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

  constructor(private readonly gameService: GameService, private prisma : PrismaService, private userService : UserService) {  
  }

  // @SubscribeMessage('newGame')
  // connectToGameService(
  // @ConnectedSocket() client)
  // {
  //   //When first client enters a quene
  //   //Winner an ID of the player that's the winner this.prisma.game.update({data: {winner: }})
  //   //Loser ID and ID of the player that's loser this.prisma.game.update({data: {loser: }})
  //   //Same for the scores
  //   // const game = this.prisma.game.create({data: {player_one: 0}});
  //   handleNewGame(client, this.server);
  //   // at the end of the game    async    add_game_to_history(game_id: number);
  // }

  @SubscribeMessage('joinGame')
  async joinGame(@MessageBody() userId : string,
  @ConnectedSocket() client)
  {

    if(!userId)
    {
      console.log("User is not logged " + userId);
      return ;
    }
    if(!roomNames[0]) 
    {
      handleNewGame(client, this.server, Number.parseInt(userId), this.prisma);
      return ;
    }
    gameCode = roomNames[0].roomName;
    
    const room = this.server.sockets.adapter.rooms[gameCode];
    
    let allUsers;

    if(room)
    {
      allUsers = room.sockets;
    }

    let numOfClients = 0;

    const sockets = await this.server.in(gameCode).fetchSockets();
    numOfClients = sockets.length;

    if(numOfClients === 0)
    {
      client.emit('unknownGame');
      return ;
    }else if(numOfClients > 1)
    {
      client.emit('tooManyPlayers')
      return ;
    }

    // 

    if(sockets[0].id === client.id || roomNames[0].gameInstance.player_one == userId)
    {
      client.emit('sameUser');
      return  ;
    };

    console.log("plz work");  
    clientRooms[client.id] = gameCode;

    client.join(gameCode);

    client.emit('init', 2);
    //GameCode == string 
    //returns an object

    //Frontend fetch( controller id : getId(userCookie))
    //Get Id on frontend from the server with getId 
    //Put it in the game 
    // (await game).id = 
    // const game = await this.prisma.game.findUnique({where:{id: gameCode}});
    console.log("Game started");
    this.prisma.game.update({where: {id: roomNames[0].gameInstance.id}, data: {player_two: Number.parseInt(userId)} });
    let gameInstance = roomNames[0].gameInstance;
    startGameInterval(this.userService ,gameCode, state, this.server, gameInstance);
    roomNames.shift();
  }
  @SubscribeMessage('createGame')
  create(@MessageBody() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @SubscribeMessage('keydown')
  handleKeyDown(@MessageBody() keyobj,
  @ConnectedSocket() client) 
  {
    const roomName = clientRooms[client.id];
    if(!roomName)
    {
      return ;
    }
     interface KeyInfo
    {
        key: number,
        player_number: number;
    }
    keyobj = JSON.parse(keyobj);
    if(keyobj.player_number == 1)
    {
      if(state[roomName])
        state[roomName].keysPressed_p1[keyobj.key] = true;
    }else if(keyobj.player_number == 2)
    {
      if(state[roomName])
        state[roomName].keysPressed_p2[keyobj.key] = true;
    }
  }

  @SubscribeMessage('keyup')
  handleKeyUp(@MessageBody() keyobj,
  @ConnectedSocket() client)
  {
    interface KeyInfo
    {
        key: number,
        player_number: number;
    }
    const roomName = clientRooms[client.id];
    if(!roomName)
    {
      return ;
    }
    keyobj = JSON.parse(keyobj);

    if(keyobj.player_number == 1)
    {
      if(state[roomName])
      {
        state[roomName].keysPressed_p1[keyobj.key] = false;
      }
    }else if(keyobj.player_number == 2)
    {
      
      if(state[roomName])
      {
        state[roomName].keysPressed_p2[keyobj.key] = false;
      }
    }
  }

  @SubscribeMessage('PaddleUpdate')
  PaddleUpdate(@MessageBody() Paddle1Y) {
    console.log("Paddle is on", Paddle1Y);
    // return this.gameService.findOne(id);
  }

  @SubscribeMessage('updateGame')
  update(@MessageBody() updateGameDto: UpdateGameDto) {
    return this.gameService.update(updateGameDto.id, updateGameDto);
  }

  @SubscribeMessage('removeGame')
  remove(@MessageBody() id: number) {
    return this.gameService.remove(id);
  }
}
