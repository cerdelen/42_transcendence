import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket } from 'socket.io' //good
import { Server, Socket as socket_io } from 'socket.io';
let readyPlayerCount : number = 0;
let roomNumber : number = 0;
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

  @SubscribeMessage('createGame')
  create(@MessageBody() createGameDto: CreateGameDto) {
    console.log("Siemanko ziomeczku");
    return this.gameService.create(createGameDto);
  }

  @SubscribeMessage('ready')
  ready(socket: Socket, roomId: string) {
    
    let id : string = 'room ' + roomNumber;
    socket.join(id);

    console.log("Siemanko to jest id pokoju " + id);
    
    readyPlayerCount++;
    if (readyPlayerCount  === 2) 
    {
      this.server.to(id).emit('startGame');
      console.log("Game should start now in room " + id );
      roomNumber++;
      readyPlayerCount = 0;
    }
  }

  @SubscribeMessage('findOneGame')
  findOne(@MessageBody() id: number) {
    return this.gameService.findOne(id);
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
