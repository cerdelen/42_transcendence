import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket } from 'socket.io' //good
import { Server, Socket as socket_io } from 'socket.io';
import {getInitialState, gameLoop} from './make_game_state'
let readyPlayerCount : number = 0;
let roomNames : string[] = [];
let roomName : string = "";
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
  roomName = makeid(5);
  clientRooms[client.id] = roomName;
  client.emit('gameCode', roomName);

  state[roomName] = getInitialState();

  client.join(roomName);

  client.emit('init', 1);
  roomNames.push(roomName);
  console.log("Game created ");
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
  async joinGame(@MessageBody() gameCode : string,
  @ConnectedSocket() client)
  {
    if(!roomNames[0])
    {
      handleNewGame(client, this.server);
      return ;
    }
    gameCode = roomNames[0];
    console.log("Code to " + gameCode );
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

    if(sockets[0].id === client.id)
    {
      console.log("Same user wants to join the game as the one that craeted it");
      client.emit('unknownGame');
      return  ;
    };
    clientRooms[client.id] = gameCode;

    client.join(gameCode);

    client.emit('init', 2);

    startGameInterval(gameCode, state, this.server);
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
    console.log("Clicked " + keyobj.player_number);
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
