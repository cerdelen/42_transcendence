import { User, ChatParticipants } from '@prisma/client';


export type CreateConversationParams = {
	authorId: number;
	recipientId: number;
	message: string;
}

export type ConversationIdentityType = 'author' | 'recipient'


export type FindParticipantParams = Partial<{
	id: number;	 
}>

export interface AuthenticatedRequest extends Request {
	user: User;
}

export type FindUserParams = Partial<{
	id: number;
	email: string;
	username: string;
}>

export type CreateUserDetails = {
	id: number,
	name: string,
	mail: string,
	ChatParticipants: ChatParticipants,
	two_FA_enabled: boolean,
	two_FA_secret: 	string | null
}

export type UserWhereUniqueInput = {
    id?: number
    name?: string
  }

  export type UserUpdateInput = {
    id?:  number
    name?: string
    mail?: string
    two_FA_enabled?: boolean
    two_FA_secret?: string | null
  }

  export type CreateParticipantParams = {
	id: number;
  }