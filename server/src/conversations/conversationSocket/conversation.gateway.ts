import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ConversationService } from '../conversations.service';

@WebSocketGateway((
	{
	  cors: {
		origin: '*',
	  },
	}
  ))
export class conversationGateway implements OnGatewayConnection{
	constructor (private conversationService: ConversationService)
	{

	}


	handleConnection(client: any, ...args: any[])
	{
		client.setMaxListeners(20);
	}
		@WebSocketServer()
		server;
		onModuleInit() {
			console.log("created this conversation gatway");
			this.server.sockets.setMaxListeners(20);
		}

		@SubscribeMessage('leave_group_chat')
		async handle_leaves_chat(
			@MessageBody() data: any) {
				const conv = await this.conversationService.leave_conversation(Number(data.chat_id), Number(data.userId));
				if (conv == null)
					this.server.emit('some_one_left_group_chat', {conv_id: Number(data.chat_id), left_user_id: Number(data.userId), conv_still_exists: false})
				else
				{
					if(conv.conversation_participant_arr.indexOf(Number(data.userId)) == -1)
						this.server.emit('some_one_left_group_chat', {conv_id: Number(data.chat_id), left_user_id: Number(data.userId), conv_still_exists: true})
				}
		}

		@SubscribeMessage('create_dialogue')
 		async create_dialogue(
			@MessageBody() data: any) {

				const userid_creator : number = Number(data.userid_creator);
				const other_user : number = Number(data.other_user);
				const check = await this.conversationService.findDialogue(Number(userid_creator), Number(other_user));
				if (check)
					return check;
				const arr: number[] = [Number(other_user), Number(userid_creator)];
				
				const new_dialogue = await this.conversationService.createConversation({
					conversation_participant_arr: arr,
				})
				this.conversationService.updateConversationIdInUser(Number(other_user), new_dialogue.conversation_id);
				this.conversationService.updateConversationIdInUser(Number(userid_creator), new_dialogue.conversation_id);
				const ret = await this.conversationService.name_fix(new_dialogue, userid_creator);
				this.server.emit("new_dialogue_created", {userid_creator: userid_creator, other_user: other_user, chat_id: ret.conversation_id});
		}

		async	joined_chat(chat_id: number, user_id:number)
		{
			this.server.emit('some_one_joined_group_chat', {conv_id: chat_id, joined_user_id: user_id});
		}
} 
