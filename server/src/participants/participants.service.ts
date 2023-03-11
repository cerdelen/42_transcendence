// import { Injectable } from "@nestjs/common";
// import { IChatParticipantsService } from './participants';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { ChatParticipant, PrismaClient, Chat, Prisma } from '@prisma/client';
// import { FindParticipantParams, CreateParticipantParams } from '../utils/types';
// import { userInfo } from "os";


// @Injectable()
// export class ParticipantsService implements IChatParticipantsService {

// 	constructor(
// 		private prisma: PrismaService
// 		) {}
// 		async findParticipant(params: FindParticipantParams): Promise<ChatParticipant | null> {
// 			return await this.prisma.chatParticipant.findFirst({
// 				where: {
// 					ChatPartId: params.id
// 				}
// 			})
// 		}

// 		createParticipant(params: CreateParticipantParams): Promise<ChatParticipant> {
// 			const participant = this.prisma.chatParticipant.create({
// 				data: {
// 					ChatPartId: Number(params.id),
// 					userId: {
// 						connect: {
// 							id: Number(params.id)
// 						}
// 					}
// 					// ChatPartId: params.id
// 					// userId: {
// 					// 	connect: {
// 					// 		id: params.id
// 					// 	}
// 					// }
// 				}
// 			})	
// 			return participant;
// 		}
 
// }