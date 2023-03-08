import { ChatParticipants, Chat } from '@prisma/client';
import { FindParticipantParams, CreateParticipantParams } from '../utils/types';

export interface IChatParticipantsService {
	findParticipant(params: FindParticipantParams): Promise<ChatParticipants> | null;
	createParticipant(params: CreateParticipantParams): Promise<ChatParticipants>
}