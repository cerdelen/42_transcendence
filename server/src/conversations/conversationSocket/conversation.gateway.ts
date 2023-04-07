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
				const enum Status {
					NO_CHAT,
					NO_CHANGE,
					NEW_OWNER_AND_ADMIN,
					NEW_OWNER,
					NEW_ADMIN,
					LEFT_CHAT,
				}
				const status: number = await this.conversationService.leave_conversation(Number(data.chat_id), Number(data.userId));
				const new_conv = await this.conversationService.findConversation(Number(data.chat_id));
				// console.log("ANything else?", status, typeof(status));
				
				if (status == Status.NO_CHAT)
					this.server.emit('some_one_left_group_chat', {conv_id: Number(data.chat_id), left_user_id: Number(data.userId), conv_still_exists: false})
				else
				{
					if (status == Status.NO_CHANGE)
						return ;
					if (status == Status.NEW_OWNER_AND_ADMIN){
						this.new_admin_has_been_set(new_conv.conversation_id, new_conv.conversation_admin_arr[0])
						this.new_owner_has_been_set(new_conv.conversation_id, new_conv.conversation_owner_arr[0])
						this.server.emit('some_one_left_group_chat', {conv_id: Number(data.chat_id), left_user_id: Number(data.userId), conv_still_exists: true})
						return ;
					}
					if (status == Status.NEW_OWNER) {
						this.new_owner_has_been_set(new_conv.conversation_id, new_conv.conversation_owner_arr[0])
						this.server.emit('some_one_left_group_chat', {conv_id: Number(data.chat_id), left_user_id: Number(data.userId), conv_still_exists: true})
						return ;
					}
					if (status == Status.NEW_ADMIN) {
						this.new_admin_has_been_set(new_conv.conversation_id, new_conv.conversation_admin_arr[0])
						this.server.emit('some_one_left_group_chat', {conv_id: Number(data.chat_id), left_user_id: Number(data.userId), conv_still_exists: true})
						return ;
					}
					if(status == Status.LEFT_CHAT)
					{
						console.log("left chat case");
						this.server.emit('some_one_left_group_chat', {conv_id: Number(data.chat_id), left_user_id: Number(data.userId), conv_still_exists: true})
					}
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

		async created_chat(chat_id: number, creator_id: number) {
			this.server.emit('created_group_chat', {chat_id: chat_id, creator_id: creator_id})
		}

		async new_admin_has_been_set(chat_id: number, admin_id: number) {
			console.log("new admin");
			this.server.emit('new_admin_has_been_set', {chat_id: chat_id, admin_id: admin_id});	
		}

		async new_owner_has_been_set(chat_id: number, owner_id: number) {
			console.log("new owner");
			this.server.emit('new_owner_has_been_set', {chat_id: chat_id, owner_id: owner_id});	
		}

		async mute_user(chat_id: number, muted_user_id: number) {
			console.log("new mute user");
			this.server.emit('mute_user', {chat_id: chat_id, muted_user_id: muted_user_id});	
		}

		async unmute_user(chat_id: number, unmuted_user_id: number) {
			console.log("new unmute user");
			this.server.emit('unmute_user', {chat_id: chat_id, muted_user_id: unmuted_user_id});	
		}

}
