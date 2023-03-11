import { Chat, User } from '@prisma/client';
import { CreateConversationParams } from '../utils/types';

export interface IConversationsService {
 	createConversation(user: User, conversationParams: CreateConversationParams);
	find() : Promise<Chat[]>
} 

