import { OnEvent } from '@nestjs/event-emitter';
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { JwtPayload } from '../../dist/auth/strategies/jwt.strategy';
// import { Conversation } from '@prisma/client';
// import { ConversationService } from 'src/conversations/conversations.service';
// import { AuthService } from '../auth/auth.service';
// import { UserService } from '../user/user.service';
import { Server } from 'socket.io';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MsgService } from 'src/msg/msg.service';
import { io_server } from 'src/utils/Server';

// import { Server } from '@nestjs/platform-socket.io';

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
	constructor (private msg: MsgService)
	{
	}

		@WebSocketServer()
		server;
		onModuleInit() {
			console.log("constructed this shit");
		}

		@SubscribeMessage('message')
		handleCreateMessage(
			@MessageBody() data: any) {
				console.log("here is msg subscriber");
				console.log(JSON.stringify(data));
				
				this.msg.createMsg(data);
				this.server.emit("message", {text: data.message, author_id: data.author});
		}

		@SubscribeMessage('typing')
		handle_is_typing(
			@MessageBody() data: any) {
				console.log("here is handle_is_typing subscriber");
				console.log(JSON.stringify(data));
				
				this.server.emit('typing', {isTyping: data.isTyping, name: data.userId})
				// this.msg.createMsg(data);
		}

		@OnEvent('create.message')
		handleMessageCreateEvent(payload: any) {
			console.log("hello");
			console.log(payload);
		}
}