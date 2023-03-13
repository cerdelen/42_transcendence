import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket } from 'socket.io' //good
import { Server, Socket as socket_io } from 'socket.io';
import {getInitialState, gameLoop} from './make_game_state'
let readyPlayerCount : number = 0;
let roomNumber : number = 0;
const state = getInitialState();

function startGameInterval(client : Socket, state: any)
{
  const intervalId = setInterval(() =>
  {
    const winner : number = gameLoop(state);

    if(!winner)
    {
      client.emit('gameState', JSON.stringify(state));
    }else{
      client.emit('gameOver');
      clearInterval(intervalId);
    }
  }, 1000 / 50);
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

  @SubscribeMessage('connectToGameService')
  connectToGameService(@MessageBody() data, 
  @ConnectedSocket() client : Socket)
  {

    startGameInterval(client, state);
  }


  @SubscribeMessage('createGame')
  create(@MessageBody() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @SubscribeMessage('keydown')
  handleKeyDown(@MessageBody() keyCode: number,
  @ConnectedSocket() client : Socket) {
    state.keysPressed[keyCode] = true;
  }

  @SubscribeMessage('keyup')
  handleKeyUp(@MessageBody() keyCode: number, 
  @ConnectedSocket() client)
  {
    state.keysPressed[keyCode] = false;
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
