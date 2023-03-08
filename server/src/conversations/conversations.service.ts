import { Inject, Injectable } from "@nestjs/common";
import { IConversationsService } from './conversations';
import { Chat, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Services } from "src/utils/consts";
import { ParticipantsService } from '../participants/participants.service';
import { IChatParticipantsService } from '../participants/participants';
import { CreateConversationParams } from '../utils/types';
import { UserService } from '../user/user.service';


@Injectable()
export class ConversationsService implements IConversationsService {

	constructor(
		private prisma: PrismaService,
		@Inject(Services.PARTICIPANTS)
		private readonly ParticipantsService: IChatParticipantsService,
		@Inject(Services.USERS)
		private readonly UserService: UserService
		) {}

	async createConversation(user: User, params: CreateConversationParams) {
		const userDB = await this.UserService.findUserById({id: user.id});
		let newParticipant;
		if (!userDB.id) {
			newParticipant = this.ParticipantsService.createParticipant({ id: params.authorId})
		}
		const savedParticipant = await this.prisma.chatParticipants.create({data: newParticipant})
		// const author = await this.ParticipantsService.findParticipant();
		
			
		}

		const recipient = await this.ParticipantsService.findParticipant({
			id: params.recipientId,
		});
 
  	}
}