import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Conversation, PrismaClient } from '@prisma/client';
import { Message } from '@prisma/client';
import { CreateMsgParams } from '../utils/types';
import { identity } from 'rxjs';
import { MsgUpdatePayload } from '../utils/types';
import { ConversationService } from '../conversations/conversations.service';
import { CreateMsgDto } from './CreateMsg.dto';
import { UserService } from '../user/user.service';
import { ConfigModule } from '@nestjs/config';
import { use } from 'passport';





@Injectable()
export class MsgService {
	constructor (
		private prisma: PrismaService,
		private readonly conversation: ConversationService,
		private readonly user: UserService
	) {}
		// async	updateMsg(params:{
		// 	where: Prisma.MessageWhereUniqueInput,
		// 	data: Prisma.MessageUpdateInput,
		// }) : Promise<Message>
		// {
		// 	const { where, data } = params;
		// 	return this.prisma.message.update({
		// 		data,
		// 		where,
		// 	});
		// }

		async updateMsg(payload: MsgUpdatePayload) {
			const {msg_id, text} = payload;
			return this.prisma.message.update({
				where: {
					msg_id,
				},
				data: {
					text,
				}
			})
		}

		async deleteManyMsgs(): Promise<Prisma.BatchPayload> {
			try {

				const toDeleteMany = this.prisma.message.deleteMany({})
				return toDeleteMany
			} catch(error) {
				if (error instanceof Prisma.PrismaClientKnownRequestError &&
					error.code === "P2025") {
						console.log("Couldn't find an item to deleteMany");
					}
			}
		}

		async deleteMsg(where: Prisma.MessageWhereUniqueInput): Promise<Message> {
			try {

				const toDelete = await this.prisma.message.delete({
					where: {},
				})
				console.log("deletedUser = " + toDelete);
				return toDelete;		
			} catch(error) {
				if (error instanceof Prisma.PrismaClientKnownRequestError &&
					error.code === "P2025") {
						console.log("Couldn't find an item to delete");
				}
				}
		}
				// }).catch(() => {
					// 	throw new NotFoundException(`Couldn't find an item to delete`)

		async createMsg(createMsgDto: CreateMsgDto) {
			// console.log("DATA.USER_ID = " + createMsgDto.);
			console.log("createMsg function");
			
			console.log("DATA.TEXT = " + createMsgDto.text);
			// const conversat = await this.prisma.conversation.findUnique({
			// 	where: {
			// 		conversation_id: Number(createMsgDto.user_id)
			// 	},
			// })
			// console.log("CONVERSATION_ID = " + conversat.conversation_id);
			// console.log(createMsgDto.user_id);
			// console.log(conversat.conversation_id);
			
			// if (!conversat)
			// 	throw new HttpException('Conversat not found', HttpStatus.BAD_REQUEST);

			const convers = await this.conversation.findConversation(createMsgDto.conversation_id);
			console.log(convers.conversation_id);
			if (!convers)
				throw new HttpException("Conversation was not found", HttpStatus.FORBIDDEN);
				console.log("CONVERSATION = " + convers.conversation_id);
			const user = await this.user.findUserById(createMsgDto.author);
			// console.log("USER.NAME = " + user.name);
			
			if (!user)
				throw new HttpException("User was not found", HttpStatus.FORBIDDEN);
			// console.log("USER = " + user.id);
			
			const newMsg = await this.prisma.message.create({
				data: { 
					text: createMsgDto.text,
					conversation_id: createMsgDto.conversation_id,
					author: createMsgDto.author,
					// user_name: user.name
				},
				include: {
					user_relation: {
						select: {
							user_msg_arr: true,
							id: true
						}    
					}
				}
			})
			// if (conversat.conversation_id !== user.id ) {
			// 	throw new HttpException('cannot create msg', HttpStatus.FORBIDDEN);
			// }
			// const newMsg = this.prisma.message.create ({
			// 	data: {
			// 		text,
			// 		conversation_id,
			// 		user_id: user.id,
			// 		// created_at: Date.now()
			// 	}
			// })
			// const saveMsg = await this.prisma.message.update(newMsg);
			// });
		}

		// async createMsg(data: Prisma.MessageCreateInput) {

		// 	return this.prisma.message.create({
		// 		data,
		// 	})
		// }
		// async Msgs(params: {
		// 	skip?: number,
		// 	take?: number,
		// 	cursor?: Prisma.MessageWhereUniqueInput,
		// 	where?: Prisma.MessageWhereInput
		// }) : Promise<Message[]> {
		// 	const {skip, take, cursor, where} = params;
		// 	return this.prisma.message.findMany({
		// 		skip,
		// 		take,
		// 		cursor,
		// 		where
		// 	});			
			// const convers = this.conversation.findConversation(conversationId);
			// return this.prisma.message.findUnique(convers);
		// }
		
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
						// 	id: true
						// }
					// }
				},
			})
			return Msg;
		}

		async getMsgByUser(user_id: number): Promise<Message[]> {
			const existingUser = await this.user.findUserById(user_id);
			if (!existingUser)
				throw new HttpException("user was not found", HttpStatus.BAD_REQUEST);
			// console.log("existinguser.name = " + existingUser.name);
			const messages = await this.prisma.message.findMany({
				where: {
					author: +user_id,
					// user_name: existingUser.name
				},
				// select: {
				// 	author: true,
				// 	user_name: true,
					// author: +user_id,
					// user_name: existingUser.name
				// }
			})
			return messages;
		}
}