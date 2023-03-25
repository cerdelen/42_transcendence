import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket as socket_io } from 'socket.io';
import {getInitialState, gameLoop} from './make_game_state'
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { io_server } from 'src/utils/Server';
import { interval } from 'rxjs';
let roomNames : {roomName: string, gameInstance: any}[] = [];

const state = {};
const clientRooms = {};
let gameCode : string = "";

let response : number = 0;

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

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log("connected");
      setInterval(() => 
      {
        socket.emit("online_check");
        if(response === 0)
        {
          //socket.id switch user offline with userID
          console.log("Is offline");
        }
        response = 0;
      }, 10000)
    })
  }

  constructor(private readonly gameService: GameService, private prisma : PrismaService, private userService : UserService) {  
  }

  @SubscribeMessage("online_inform")
  async handle_online(@MessageBody() userId: string)
  {
    if(userId)
    {
      //make user online
      response = 1;
      console.log("User is online");
    }
  }
  @SubscribeMessage('makeOnline')
  async makeOnline(@MessageBody() userId: string)
  {

    console.log(userId + " Siemanko ");
    //Make user online boolean
  }

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
      console.log("this is in the subscriber " + userId);
      
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

    clientRooms[client.id] = gameCode;

    client.join(gameCode);

    client.emit('init', 2);

    await this.prisma.game.update({where: {id: roomNames[0].gameInstance.id}, data: {player_two: Number.parseInt(userId)} });
    let gameInstance = roomNames[0].gameInstance;
    startGameInterval(this.userService ,gameCode, state, this.server, gameInstance, this.prisma);
    roomNames.shift();
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
}


function emitGameState(roomName: string, state : any, server: Server)
{
  server.sockets.in(roomName).emit('gameState', JSON.stringify(state));

}

async function emitGameOver(userService: any,roomName : string, winner: number, server: Server, game: any, prisma: PrismaService, player_two: number)
{
  // winner : 1
  // loser: 2
  console.log("start of emitGameOver");
  
  // const temp = await prisma.game.findUnique({where: {id:game.id}})
  // if (temp)
  //   {}
  if(winner == 1)
  {
    server.sockets.in(roomName).emit('gameOver', Number.parseInt(game.player_one));
    game.winner = game.player_one;
    game.loser = player_two;
  }else{

    game.winner = player_two;
    game.loser = game.player_one;
    server.sockets.in(roomName).emit('gameOver', (player_two));
  }
  if(!game.score_one)
  {
    game.score_one = state[roomName].player_1_score;
    game.score_two = state[roomName].player_2_score;
    game.finished = true;
    await prisma.game.update({
      where: {id: game.id}, 
      data: { 
        winner: game.winner,
        loser: game.loser,
        score_one: game.score_one,
        score_two: game.score_two,
        finished: true,
      }});
    userService.add_game_to_history(game.id);
  }

}
async function startGameInterval(userService: any, roomName : string, state: any, server: Server, game :any, prisma: PrismaService)
{
  let other_game = await prisma.game.findUnique({ where: {id:game.id} });
  console.log("other games second player id " + other_game.player_two );
  
  const intervalId = setInterval(() =>
  {
    const winner : number = gameLoop(state[roomName]);
    if(!winner)
    {
      emitGameState(roomName, state[roomName], server);
    }else{
      emitGameOver(userService ,roomName, winner, server, game, prisma, other_game.player_two);
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
  console.log('newgame player id 1 is'  + clientId);
  
  const game = await prisma.game.create({data: {player_one: clientId}});

  clientRooms[client.id] = game.id.toString();
  client.emit('gameCode', game.id.toString());
  state[game.id] = getInitialState();

  client.join(game.id.toString());

  client.emit('init', 1);
  roomNames.push({roomName: game.id.toString(),gameInstance: game});
}