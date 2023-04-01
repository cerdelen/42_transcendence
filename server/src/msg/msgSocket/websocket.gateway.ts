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
import { PrismaService } from 'src/prisma/prisma.service';
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
	constructor (
			private msg: MsgService,
			private readonly prisma: PrismaService
		
		)
	{
	}

		@WebSocketServer()
		server;
		onModuleInit() {
			console.log("constructed this shit");
		}

		@SubscribeMessage('message')
		async handleCreateMessage(
			@MessageBody() data: any) {
				console.log("here is msg subscriber");
				console.log(JSON.stringify(data));

				const conv = await this.prisma.conversation.findUnique({where: {conversation_id: data.conversation_id}});
				if (conv)
				{
					console.log(conv.conversation_mute_list_arr.includes(data.author));
					if(conv.conversation_mute_list_arr.includes(Number(data.author)))
					{						
						return ;
					}
				}
				
				this.msg.createMsg(data);
				console.log(`From backend message subscriber: message = ${data.text}, author = ${data.author}`);
				
				this.server.emit("message", {text: data.text, author_id: data.author, chat_id: data.conversation_id});
		}

		@SubscribeMessage('typing')
		async handle_is_typing(
			@MessageBody() data: any) {
				const conv = await this.prisma.conversation.findUnique({where: {conversation_id: data.chat_id}});
				if (conv)
				{
					if(conv.conversation_mute_list_arr.includes(Number(data.userId)))
					{
						console.log("returning because muted");
						return ;
					}
				}
				this.server.emit('typing', {isTyping: data.isTyping, name: data.userId, chat_id: data.chat_id})
		}

		@OnEvent('create.message')
		handleMessageCreateEvent(payload: any) {
			console.log("hello");
			console.log(payload);
		}
}