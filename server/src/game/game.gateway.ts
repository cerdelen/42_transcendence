import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket } from 'socket.io' //good
import { Server, Socket as socket_io } from 'socket.io';
import {getInitialState, gameLoop} from './make_game_state'
let readyPlayerCount : number = 0;
let roomNumber : number = 0;
const state = {};
const clientRooms = {};

function emitGameState(roomName: string, state : any, server: Server)
{
  server.sockets.in(roomName).emit('gameState', JSON.stringify(state));

}

function emitGameOver(roomName : string, winner: number, server: Server)
{
  server.sockets.in(roomName).emit('gameOver', JSON.stringify({winner}));
}
function startGameInterval(roomName : string, state: any, server: Server)
{
  const intervalId = setInterval(() =>
  {
    const winner : number = gameLoop(state[roomName]);

    if(!winner)
    {
      emitGameState(roomName, state[roomName], server);
    }else{
      emitGameOver(roomName, winner, server);
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
function handleNewGame(client: any, server: Server)
{
  let roomName = makeid(5);
  clientRooms[client.id] = roomName;
  client.emit('gameCode', roomName);

  state[roomName] = getInitialState();
  client.join(roomName);
  client.emit('init');
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

  constructor(private readonly gameService: GameService) {  
  }

  @SubscribeMessage('newGame')
  connectToGameService(
  @ConnectedSocket() client)
  {
    handleNewGame(client, this.server);
  }

  @SubscribeMessage('joinGame')
  joinGame(@MessageBody() gameCode : string,
  @ConnectedSocket() client)
  {
    let allUsers = this.server.in(gameCode).fetchSockets().then.length;

    let numOfClients = 0;
    if(allUsers)
    {
      console.log("All users ran"); 
      numOfClients = Object.keys(allUsers).length;
    }

    if(numOfClients === 0)
    {
      console.log("Num of clients === 0");
      client.emit('unknownGame');
      return ;
    }else if(numOfClients > 1)
    {
      console.log("Num of clients more than 1")
      client.emit('tooManyPlayers')
      return ;
    }

    clientRooms[client.id] = gameCode;

    client.join(gameCode);
    this.server.sockets[1].number = 2;
    client.emit('init', 2 );
    startGameInterval(gameCode, state, this.server);
  }
  @SubscribeMessage('createGame')
  create(@MessageBody() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @SubscribeMessage('keydown')
  handleKeyDown(@MessageBody() keyCode: number,
  @ConnectedSocket() client) 
  {
    const roomName = clientRooms[client.id];
    if(!roomName)
    {
      return ;
    }
    if(client.number == 1)
    {
      state[roomName].keysPressed_p1[keyCode] = false;
    }else if(client.number == 2)
    {
      state[roomName].keysPressed_p2[keyCode] = false;
    }
  }

  @SubscribeMessage('keyup')
  handleKeyUp(@MessageBody() keyCode: number, 
  @ConnectedSocket() client)
  {
    const roomName = clientRooms[client.id];
    if(!roomName)
    {
      return ;
    }
    if(client.number == 1)
    {
      state[roomName].keysPressed_p1[keyCode] = false;
    }else if(client.number == 2)
    {
      state[roomName].keysPressed_p2[keyCode] = false;
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
