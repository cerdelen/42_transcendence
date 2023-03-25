import { OnEvent } from '@nestjs/event-emitter';
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MsgService } from 'src/msg/msg.service';
import { ConversationService } from '../conversations.service';
import { conv_gateway_dto } from './conversation_gateway_dto';

@WebSocketGateway((
	{
	  cors: {
		origin: '*',
	  },
	}
  ))
export class conversationGateway implements OnGatewayConnection {
	handleConnection(client: any, ...args: any[]) {
		// console.log(client);
		
	}
	constructor (private conversationService: ConversationService)
	{
	}

		@WebSocketServer()
		server;
		onModuleInit() {
			console.log("constructed conversationgatewat");
			
		}

		@SubscribeMessage('leave_group_chat')
		handle_leaves_chat(
			@MessageBody() data: any) {
				console.log("this is leave_group_chat");
				
				console.log(JSON.stringify(data));
				const smth : conv_gateway_dto = data;
				console.log(smth.chat_id);
				this.conversationService.remove_user_from_conversation(Number(data.chat_id), Number(data.userId));
		}

} 