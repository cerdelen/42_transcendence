import { Injectable } from "@nestjs/common";
import { IChatParticipantsService } from './participants';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatParticipants, PrismaClient } from '@prisma/client';
import { FindParticipantParams, CreateParticipantParams } from '../utils/types';
import { userInfo } from "os";


@Injectable()
export class ParticipantsService implements IChatParticipantsService {

	constructor(
		private prisma: PrismaService
		) {}
		async findParticipant(params: FindParticipantParams): Promise<ChatParticipants | null> {
			return await this.prisma.chatParticipants.findUnique({
				where: {
					ChatPartsId: 0,
				}
			})
		}

		createParticipant(params: CreateParticipantParams): Promise<ChatParticipants> {
			const participant = this.prisma.chatParticipants.create({data: {ChatPartsId: params.id, userId: params.id}})	
			return this.prisma.chatParticipants.create(participant);
		}

}