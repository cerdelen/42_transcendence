import { OnEvent } from '@nestjs/event-emitter';
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { JwtPayload } from '../../dist/auth/strategies/jwt.strategy';
// import { Conversation } from '@prisma/client';
// import { ConversationService } from 'src/conversations/conversations.service';
// import { AuthService } from '../auth/auth.service';
// import { UserService } from '../user/user.service';
import { Server } from 'socket.io';
import { io_server } from 'src/utils/Server';

// import { Server } from '@nestjs/platform-socket.io';




// export type JwtPayload = {
//     name: string;
//     sub: string | Number;
//     mail: string;
//     is_two_FAed: boolean;
//     id: number
// };

@WebSocketGateway((
	{
	  cors: {
		origin: '*',
	  },
	}
  ))
export class MessagingGateway implements OnGatewayConnection {
	handleConnection(client: any, ...args: any[]) {
		// console.log(client);
		
	}
	constructor ()
	{
	}

		@WebSocketServer()
		server;
		// io = new Server(server, { cors: { origin: '*' } });


		// io_servss: io_server;

		onModuleInit() {
			console.log("constructed this shit");
		}

		@SubscribeMessage('message')
		handleCreateMessage(
			@MessageBody() data: any) {
				console.log("here connect");
				// this.io_serv.io.emit();
				// this.server.emit('message', message);


				
				// this.io_server.emit();
		}

		@OnEvent('create.message')
		handleMessageCreateEvent(payload: any) {
			console.log("hello");
			console.log(payload);
			// this.io_server.emit();
			// this.io_serv.emit();




			// this.io_server.emit('onMessage', payload)
		}
} 