import { Inject, HttpException, HttpStatus, Injectable, createParamDecorator } from '@nestjs/common';
// import { IConversationsService } from './conversations';
import { Conversation, User, PrismaClient, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Services } from "src/utils/consts";
// import { ParticipantsService } from '../participants/participants.service';
// import { IChatParticipantsService } from '../participants/participants';
import { CreateConversationParams } from '../utils/types';
import { UserService } from '../user/user.service';
// import { Message } from '../messages/entities/message.entity';
import { networkInterfaces, userInfo } from 'os';
import { skip, identity, lastValueFrom } from 'rxjs';


import { Message } from "@prisma/client"
import { conv_gateway_dto } from './conversationSocket/conversation_gateway_dto';


@Injectable()
export class ConversationService {
	constructor (
		private prisma: PrismaService, 
		private user: UserService
	) {}

	async createConversation(data: Prisma.ConversationCreateInput): Promise<Conversation> {
		console.log("PARTICIPANTS[] = " + data.conversation_participant_arr);
		console.log("JSON_DATA = " + JSON.stringify(data));
		
		const newConversation = await this.prisma.conversation.create ({
			data,
		})
		return newConversation; 
	}

	async findDialogue(user_id1: number, user_id2: number) {
		const arr: number[] = [user_id1, user_id2];
		const checkDialogue = await this.prisma.conversation.findMany({

			where: {
				group_chat: false,
				conversation_participant_arr: {
					has: user_id1, 
				}
		}})
		for (let i = 0; i < checkDialogue.length; i++) {
			if (checkDialogue[i].conversation_participant_arr.includes(user_id2)) {
				return checkDialogue[i];
			}
		}
		
	}

	async	is_pass_protected(conv_id: number)
	{
		const conv = await this.prisma.conversation.findUnique({where: {conversation_id: conv_id}});

		if (!conv)
			return false;
		return conv.conversation_pass_protected;
	}

	async	set_password(chat_id: number, user_id: number, password: string)
	{
		console.log(chat_id + "in setvice set password");
		
		const conv = await this.prisma.conversation.findUnique({where: {conversation_id: chat_id}});

		if (!conv)
			return ;
		if (conv.group_chat == false)
			return ;
		if (conv.conversation_owner_arr[0] != user_id)
			return ;
		await this.prisma.conversation.update({
			where: {
				conversation_id: chat_id
			},
			data: {
				conversation_password: password,
				conversation_pass_protected: true,
			}
		})
	}

	// async createConversation(user: User, params: CreateConversationParams) {
	// 	const userDB = await this.user.findUserById(user.id);
	// 	const {authorId, recipientId} = params;
	// 	const participants_arr: User[] = [];
	// 	if (!userDB.conversation_id_arr) {
	// 		const newParticipant = await this.prisma.conversation.create({
	// 			data: {
	// 				user_id_creator: userDB.id
	// 				}
	// 			}) 
	// 		}
	// 	}
	// }

	
	async updateConversation(
		params: {
			where: Prisma.ConversationWhereUniqueInput;
			data: Prisma.ConversationUpdateInput;
		}):
		Promise<Conversation>
		{
			const {where, data} = params;
			return this.prisma.conversation.update({
				data,
				where,
			})
		}

	async name_fix(conv: Conversation, user_id: number)
	{
		if (!conv)
			return ;
		console.log(" im trying to fix name for the this conv " + conv.conversation_id);
		if (conv.group_chat == false)
		{
			const id_1 = conv.conversation_participant_arr[0];
			const id_2 = conv.conversation_participant_arr[1];
			const user_1 = await this.prisma.user.findUnique({where: {id : id_1}})
			const user_2 = await this.prisma.user.findUnique({where: {id : id_2}})
			if (user_1 && user_2)
			{
				if(user_id == user_1.id) 
					conv.conversation_name = user_2.name;
				else
					conv.conversation_name = user_1.name;
			}
			else
				conv.conversation_name = "";
		}
		return conv;
	}
	
	async conversation(conversationwhereuniqueinput: Prisma.ConversationWhereUniqueInput) {
		return this.prisma.conversation.findUnique({
			where: conversationwhereuniqueinput
		})
	}	

	async findConversation(id: number): Promise<Conversation | undefined> {
		console.log("ID = " + id);
		if(Number.isNaN(Number(id)))
			return null;
		const foundConversation = await this.conversation({conversation_id: Number(id)});
		console.log("ID = found" );
		return foundConversation;
	}	

	// async findConversationByName(name: string) {
	// 	const foundConversation = await this.conversation({
	// 		conversation_name: name
	// 	})
	// 	return foundConversation;
	// }

	async findAllConversationsByUser(user_id: number)  {
		const existingUser = this.prisma.user.findUnique({
			where : {
				id: user_id,
			}
		})
		if (existingUser)
			return (await existingUser).conversation_id_arr;
		else 
			return [];
	}


	async getConversations(params: {
		where?: Prisma.ConversationWhereInput;
	}): Promise<Conversation[]> {
		const {where} = params;
		return this.prisma.conversation.findMany({
			where,
		},
		)
	}   

	async exclude (user, ...keys) {
		for (let id of keys) {
			delete user[id];
		}
		return user;
	}

	async getChatsUserNotPartOf(user_id :number) : Promise<number[]> {
        const convs = await this.prisma.conversation.findMany({
            where: {
                NOT: {
                    conversation_participant_arr: {
                        has: user_id,
                    },

                },


            }

        })
        let arr : number [] = [];
        for(let i: number = 0; i < convs.length; i++)
        {
            if (convs[i].group_chat == true)
                arr.push(convs[i].conversation_id);
        }
        return arr;
    }

	async getMsgsByConversationID(conversationId: number, user_id: number) : Promise<Message[]> {
		// let Msg: Message[] = await this.prisma.message.findMany({
		// 	where: {
		// 		conversation_id: Number(conversationId)
		// 	},
		// 	orderBy: {
		// 		created_at: 'desc'
		// 	},
		// })
		const	user = await this.prisma.user.findUnique({where: {id: user_id}});
		let Msg: Message[] = await this.prisma.message.findMany({
			where: {
				conversation_id: Number(conversationId),
				// NOT: {author: user.blocked_users.includes(author)}
			},
			orderBy: {
				created_at: 'desc'
			},
		})

		for(let i = 0; i < user.blocked_users.length; i++)
		{
			for (let index = 0; index < Msg.length; index++) {
				if (user.blocked_users.includes(Msg[index].author))
				{
					Msg.splice(index, 1)
					index--;
				}
			}
		}

		return Msg;
	}


	async setAdministratorOfConversation(conversId: number, adminId: number, userId: number): Promise<Conversation> {
		let conversation : Conversation;
		let user : User;
 
		conversation = await this.findConversation(conversId);
		console.log("CONVERSATION_ID = " + conversation.conversation_id);

		const index_of_user = conversation.conversation_admin_arr.findIndex(element => element === userId);
		const index_of_admin = conversation.conversation_admin_arr.findIndex(element => element === adminId);
		console.log("index_of_user = " + index_of_user);

		console.log("index_of_admin = " + index_of_admin);

		if (index_of_user == -1) {
			console.log("no user with:\t" + index_of_user)
			return conversation; 
			
		}
		// if (index_of_admin == -1)  {
		// 	console.log("current [user] is not an administrator");
		// 	return conversation;
		// }
		else if (index_of_admin > -1) {
			conversation.conversation_admin_arr.splice(index_of_admin, 0);
			const update_conversation_admin_arr = this.updateConversation({
				where: {
					conversation_id: Number(conversId),
				},
				data: {
					conversation_admin_arr: conversation.conversation_admin_arr
				}
			})
			return update_conversation_admin_arr;
		}
		else {
			return this.updateConversation({
				where: {
					conversation_id: Number(conversId)
				},
				data: {
					conversation_admin_arr: {
						push: Number(adminId)
					}
				}
			})
		}
	}

	async	leave_conversation(conversation_id: number, user_id: number) : Promise<Conversation>
	{
		const conversation : Conversation = await this.findConversation(conversation_id);
		
		if (!conversation)
			return null;

		if(conversation.group_chat == false)
			return (conversation);

		if (!conversation.conversation_participant_arr.includes(user_id))
			return conversation;

		const req_user_idx = conversation.conversation_participant_arr.indexOf(user_id, 0);
		const user : User = await this.user.findUserById(user_id);
		const conversation_id_arr_from_user = user.conversation_id_arr.indexOf(conversation_id);
		const user_admin_idx = conversation.conversation_admin_arr.indexOf(user_id);
		const user_owner_idx = conversation.conversation_owner_arr.indexOf(user_id);

		console.log("admin_array = " + conversation.conversation_admin_arr);
		console.log("owner_array = " + conversation.conversation_owner_arr);
		console.log("participant_array = " + conversation.conversation_participant_arr);
		

		// if (conversation.conversation_admin_arr.length == 1 && conversation.conversation_admin_arr[0] == user_id)
		// 	throw new HttpException("No chance to leave a chat due to minimum amount of users in a conversation! Apologies!", HttpStatus.FORBIDDEN);
		conversation.conversation_participant_arr.splice(req_user_idx, 1);
		console.log("user_admin_idx = " + user_admin_idx);
		
		if (user_admin_idx >= 0)
		{
			conversation.conversation_admin_arr.splice(user_admin_idx, 1);
			console.log("conv__admin_arr after splicing = " + conversation.conversation_admin_arr);
			
			
		} else {
			if (conversation.conversation_admin_arr.length == 0)
			{
				if (conversation.conversation_participant_arr.length > 0)
					conversation.conversation_admin_arr.push(conversation.conversation_participant_arr[0]);
			}
		}
		if (user_owner_idx > -1)
		{
			console.log("we got into here ");

			conversation.conversation_owner_arr.splice(user_owner_idx, 1);
			// if (conversation.conversation_admin_arr.length > 0)
			// 	conversation.conversation_owner_arr.push(conversation.conversation_admin_arr[0]);
			if (conversation.conversation_participant_arr.length > 0)
				conversation.conversation_owner_arr.push(conversation.conversation_participant_arr[0]);
		}
		user.conversation_id_arr.splice(conversation_id_arr_from_user, 1);
		await this.updateConversation({
			where: {
				conversation_id: Number(conversation_id),
			},
			data: {
				conversation_participant_arr: conversation.conversation_participant_arr,
				conversation_admin_arr: conversation.conversation_admin_arr,
				conversation_owner_arr: conversation.conversation_owner_arr
			}
		})
		await this.user.updateUser({
			where: {
				id: Number(user_id)
			},
			data: {
				conversation_id_arr: user.conversation_id_arr,
			}
		})
		if (conversation.conversation_participant_arr.length == 0)
		{
			this.delete_conversation(conversation_id);
			return null;
		}
		console.log("admin_array1 = " + conversation.conversation_admin_arr);
		console.log("owner_array1 = " + conversation.conversation_owner_arr);
		console.log("participant_array1 = " + conversation.conversation_participant_arr);
		return conversation;
	}

	async	delete_conversation(chat_id: number)
	{
		return this.prisma.conversation.delete({where: {conversation_id: chat_id}});
	}

	async updateConversationIdInUser(user_id: number, conversationId: number): Promise<User> {
		// console.log("HEEEEY");
		
		const conversation = await this.findConversation(conversationId);
		// console.log("CONVERSATION " + conversation.conversation_id);
		
		const updatedUser = this.user.updateUser({
			where: {
				id: user_id
			},
			data: {
				conversation_id_arr: {
					push: conversation.conversation_id
				}
			}
		})	
		return updatedUser;
	}

	async	remove_user_from_conversation(chat_id: number, userId: number, id_to_kick: number)
	{

		const conversation = await this.prisma.conversation.findUnique({
			where: {
				conversation_id: chat_id,
			}
		})
		console.log("CONVERSSS = " + conversation.conversation_id);
		
		if (!conversation) return ;

		const admin_user_idx = conversation.conversation_admin_arr.indexOf(userId, 0);
		// const idx_from_black_list = conversation.conversation_black_list_arr.findIndex(element => element == id_to_ban);
		const owner_user_idx = conversation.conversation_owner_arr.findIndex(element => element == id_to_kick);
			console.log("ADMIN_USER_IDX = " + admin_user_idx);
			// console.log("idx_from_black_list = " + idx_from_black_list);
			console.log("owner_user_idx = " + owner_user_idx);

			if (owner_user_idx >= 0) {
				console.log("HEREEEE1");
				throw new HttpException("Can't kick the conversation owner!!!", HttpStatus.FORBIDDEN);
			}
			else if (admin_user_idx < 0) {
				console.log("HEREEEE2");
				console.log("Current user is not considered to be an Administrator");
				return conversation;
			}
			// else if (idx_from_black_list >= 0) {
			// 	console.log("HEREEEE3");
				// conversation.conversation_black_list_arr.splice(idx_from_black_list, 1);
		const req_user_idx = conversation.conversation_participant_arr.indexOf(id_to_kick);
		conversation.conversation_participant_arr.splice(req_user_idx, 1);
		await this.prisma.conversation.update({
			where: {conversation_id: chat_id},
			data: {conversation_participant_arr :conversation.conversation_participant_arr }
		});
		const user = await this.prisma.user.findUnique({where: {id: id_to_kick}});
		const conv_id_from_user = user.conversation_id_arr.indexOf(chat_id);
		user.conversation_id_arr.splice(conv_id_from_user, 1);
		await this.prisma.user.update({
			where: {id: id_to_kick},
			data: {conversation_id_arr: user.conversation_id_arr}
		}); 
	}
}








// // @Injectable()
// // export class ConversationsService implements IConversationsService {

// // 	constructor(
// // 		private prisma: PrismaService,
// // 		@Inject(Services.PARTICIPANTS)
// // 		private readonly ParticipantsService: IChatParticipantsService,
// // 		@Inject(Services.USERS)
// // 		private readonly UserService: UserService
// // 		) {}
		
// 	// async createConversation(user: User, params: CreateConversationParams) {
// 	// 	console.log("ERROR" + user.mail);
// 	// 	const userDB = await this.UserService.findUserById(user.id);
// 	// 	if (!userDB.chatPtsId) {
// 	// 		const newParticipant = await this.ParticipantsService.createParticipant({ id: params.authorId})
// 	// 		userDB.chatPtsId = newParticipant.ChatPartId;
// 	// 		await this.UserService.saveUser(userDB);
// 	// 	}
		
// 	// 	// const author = await this.ParticipantsService.findParticipant();

// 	// 	const recipient = await this.ParticipantsService.findParticipant({
// 	// 		id: params.recipientId,
// 	// 	});
 
//   	// }

// 		async find() {
// 			return this.prisma.chat.({
// 				where: {
					
// 				}
// 			})
// 		}

// 	//   export class ConversationsService implements IConversationsService {
// 	  	async createConversation(user: User, conversationParams: CreateConversationParams) {
// 			  // if (!userDB.chatPtsId) {
// 				  // 	const newParticipant = await this.ParticipantsService.createParticipant({id: conversationParams.authorId});
// 				  // 	userDB.chatPtsId = newParticipant.ChatPartId;
// 				  // }
// 				//   let userDB: User;
// 				//   try {
// 					console.log(user.id);
					
// 					const userDB = await this.UserService.findUserById(user.id)
// 					console.log("AUTHOR " + conversationParams.authorId);
// 					console.log("RECIPIENT " + conversationParams.recipientId);
// 					if (!userDB.chatPtsId) {
// 						const newParticipant = await this.ParticipantsService.createParticipant({id: conversationParams.authorId})
// 						// await this.createParticipantSaveUser(userDB, conversationParams.authorId);
// 					// 	userDB.chatPtsId = newParticipant.ChatPartId;
// 					// 	this.UserService.updateUser({ 
// 					// 		where: { id: userDB.id },
// 					// 		data: { chatPtsId: newParticipant }
// 					// })	
// 					}
// 				// 	const recipient = await this.UserService.findUserById(conversationParams.recipientId)
// 				// 	if (!recipient) throw new HttpException('User was not found', HttpStatus.BAD_REQUEST);
// 				// 	if (!recipient.chatPtsId) {

// 				// 		const newParticipant = await this.ParticipantsService.createParticipant({
// 				// 			id: conversationParams.recipientId,
// 				// 		}) 
  
// 				// 	}
					

// 				// }
// 				// private async createParticipantSaveUser(user: User, id: number) {
// 				// 	const participant = await this.ParticipantsService.createParticipant({
// 				// 		id,
// 				// 	})
// 				// 	user.chatPtsId = participant.ChatPartId;
// 				// 	return this.UserService.saveUser(user);
// 				}
				  
				  
// 				// const newParticipant = await this.ParticipantsService.createParticipant({id})
// 				//   if (!userDB.chatPtsId) {
// 				// 	  const newParticipant = await this.ParticipantsService.createParticipant({id: conversationParams.authorId})
// 				// 	  userDB.chatPtsId = newParticipant.ChatPartId
// 				// 	  await this.UserService.saveUser(userDB);
// 				// 	}
// 				// 	console.log(userDB);


// 			// const recipient = await this.ParticipantsService.findParticipant({id: conversationParams.recipientId});
		
// }
// // }
