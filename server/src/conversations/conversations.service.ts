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

	async conversation(conversationwhereuniqueinput: Prisma.ConversationWhereUniqueInput): Promise<Conversation | null> {
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

	async getMsgsByConversationID(conversationId: number) : Promise<Message[]> {
		let Msg: Message[] = await this.prisma.message.findMany({
			where: {
				conversation_id: Number(conversationId)
			},
			orderBy: {
				created_at: 'desc'
			},
			//in frontend i guess we will compare users id and logged in email for validation matter, if id is not the same, we know its not the user
			include: {
				user_relation: true
					// select: {
					//     id: true
					// }
				// }
			},
		})
		return Msg;
	}

	

	async setAdministratorOfConversation(conversId: number, adminId: number): Promise<Conversation> {
		let conversation : Conversation;
		let user : User;
		conversation = await this.findConversation(conversId);
		const index_of_user = conversation.conversation_admin_arr.findIndex(element => element === user.id);
		if (!index_of_user) throw new Error("no user with:\t" + index_of_user);
		const index_of_admin = conversation.conversation_admin_arr.findIndex(element => element === adminId);
		if (index_of_admin == -1)  throw new Error("current [" + user.name + "] is not an administrator");
		else {
			conversation.conversation_admin_arr.splice(index_of_admin, 1);
			const update_conversation_admin_arr = this.prisma.conversation.update({
				where: {
					conversation_id: Number(conversId),
				},
				data: {
					conversation_admin_arr: {
						push: Number(adminId)
					}
				}
			})
			return update_conversation_admin_arr;
		}
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

	async	remove_user_from_conversation(chat_id: number, userId: number)
	{
		const conv = await this.prisma.conversation.findUnique({
			where: {
				conversation_id: chat_id
			}
		})
		if (!conv)
			return ;
		if (conv.group_chat == false)
		return ;
		const ind_1 = conv.conversation_participant_arr.indexOf(userId);
		conv.conversation_participant_arr.splice(ind_1, 1);
		await this.prisma.conversation.update({
			where: {conversation_id: chat_id},
			data: {conversation_participant_arr :conv.conversation_participant_arr }
		});
		const user = await this.prisma.user.findUnique({where: {id: userId}});
		const ind_2 = user.conversation_id_arr.indexOf(chat_id);
		user.conversation_id_arr.splice(ind_2, 1);
		await this.prisma.user.update({
			where: {id: userId},
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
