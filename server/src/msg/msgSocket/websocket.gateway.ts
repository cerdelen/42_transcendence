import { OnEvent } from '@nestjs/event-emitter';
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MsgService } from 'src/msg/msg.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway((
	{
	  cors: {
		origin: '*',
	  },
	}
  ))
export class MessagingGateway implements OnGatewayConnection {
	handleConnection(client: any, ...args: any[])
	{
		client.setMaxListeners(20);
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
			console.log("created this message gateway");
			this.server.sockets.setMaxListeners(20);
		}
		@SubscribeMessage('message')
		async handleCreateMessage(
			@MessageBody() data: any) {
				//console.log("here is msg subscriber");
				////console.log(JSON.stringify(data));

				const conv = await this.prisma.conversation.findUnique({where: {conversation_id: data.conversation_id}});
				if (conv)
				{
					////console.log(conv.conversation_mute_list_arr.includes(data.author));
					if(conv.conversation_mute_list_arr.includes(Number(data.author)))
					{						
						return ;
					}
				}
				
				this.msg.createMsg(data);
				////console.log(`From backend message subscriber: message = ${data.text}, author = ${data.author}`);
				
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
						////console.log("returning because muted");
						return ;
					}
				}
				this.server.emit('typing', {isTyping: data.isTyping, name: data.userId, chat_id: data.chat_id})
		}

		@OnEvent('create.message')
		handleMessageCreateEvent(payload: any) {
			////console.log("hello");
			////console.log(payload);
		}
}