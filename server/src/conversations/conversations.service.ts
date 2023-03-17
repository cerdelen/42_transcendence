import { Inject, HttpException, HttpStatus, Injectable, createParamDecorator } from '@nestjs/common';
// import { IConversationsService } from './conversations';
import { Conversation, User, PrismaClient, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Services } from "src/utils/consts";
// import { ParticipantsService } from '../participants/participants.service';
// import { IChatParticipantsService } from '../participants/participants';
import { CreateConversationParams } from '../utils/types';
import { UserService } from '../user/user.service';
import { Message } from '../messages/entities/message.entity';
import { networkInterfaces } from "os";



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
		const foundConversation = await this.conversation({conversation_id: Number(id)});
		return foundConversation;
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
