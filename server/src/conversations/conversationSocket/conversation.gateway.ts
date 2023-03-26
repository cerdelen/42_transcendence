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
		async handle_leaves_chat(
			@MessageBody() data: any) {
				console.log("this is leave_group_chat");
				
				console.log(JSON.stringify(data));
				const smth : conv_gateway_dto = data;
				console.log(smth.chat_id);
				const conv = await this.conversationService.leave_conversation(Number(data.chat_id), Number(data.userId));
				if (conv == null)
					this.server.emit('some_one_left_group_chat', {conv_id: Number(data.chat_id), left_user_id: Number(data.userId), conv_still_exists: false})
				else
				{
					if(conv.conversation_participant_arr.indexOf(Number(data.userId)) == -1)
						this.server.emit('some_one_left_group_chat', {conv_id: Number(data.chat_id), left_user_id: Number(data.userId), conv_still_exists: true})
				}
		}

} 

// conv_id, left_user_id, conv_still_exists