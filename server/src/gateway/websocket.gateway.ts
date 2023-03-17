import { OnEvent } from '@nestjs/event-emitter';
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { JwtPayload } from '../../dist/auth/strategies/jwt.strategy';
// import { Conversation } from '@prisma/client';
// import { ConversationService } from 'src/conversations/conversations.service';
// import { AuthService } from '../auth/auth.service';
// import { UserService } from '../user/user.service';
import { Server } from 'socket.io';

// import { Server } from '@nestjs/platform-socket.io';




// export type JwtPayload = {
//     name: string;
//     sub: string | Number;
//     mail: string;
//     is_two_FAed: boolean;
//     id: number
// };

@WebSocketGateway()
export class MessagingGateway implements OnGatewayConnection {
	handleConnection(client: any, ...args: any[]) {
		console.log(client);
		
	}
	// constructor (
		// private readonly conversationService: ConversationService,
		// private readonly authService: AuthService,
		// private readonly userService: UserService) {}

		@WebSocketServer()
		server: Server;

		// onModuleInit() {
		// 	this.server.on('connection', (socket) => {
		// 		console.log(socket.id);
		// 		console.log("connected");
				
		// 	})
		// }

		@SubscribeMessage('message')
		handleCreateMessage(
			@MessageBody() data: any) {
				console.log("here connect");
				
				// this.server.emit('message', message);
		}

		@OnEvent('create.message')
		handleMessageCreateEvent(payload: any) {
			console.log("hello");
			console.log(payload);
			this.server.emit('onMessage', payload)
			
		}
} 