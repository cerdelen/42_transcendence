import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { JwtPayload } from '../../dist/auth/strategies/jwt.strategy';
import { Conversation } from '@prisma/client';
import { ConversationService } from './conversations.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
// import { Server } from '@nestjs/platform-socket.io';



// export type JwtPayload = {
//     name: string;
//     sub: string | Number;
//     mail: string;
//     is_two_FAed: boolean;
//     id: number
// };

@WebSocketGateway()
export class ConversationGateway {
	constructor (
		private readonly conversationService: ConversationService,
		private readonly authService: AuthService,
		private readonly userService: UserService) {}

		@WebSocketServer()
		server;

		// onModuleInit() {
		// 	this.server.on('connection', (socket) => {
		// 		console.log(socket.id);
		// 		console.log("connected");
				
		// 	})
		// }

		@SubscribeMessage('message')
		onNewMessage(
			@MessageBody() message: string): void {
				console.log("here connect");
				
				// this.server.emit('message', message);
			}
}