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
			console.log("DATA.USER_ID = " + createMsgDto.user_id);
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
			const user = await this.user.findUserById(createMsgDto.user_id);
			if (!user)
				throw new HttpException("User was not found", HttpStatus.FORBIDDEN);
			console.log("USER = " + user.id);
			
			const newMsg = await this.prisma.message.create({
				data: {
					text: createMsgDto.text,
					user_id: createMsgDto.user_id,
					conversation_id: createMsgDto.conversation_id,   
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
		async getMsg() : Promise<Message[]> {
			return this.prisma.message.findMany();
		}

		
		
}