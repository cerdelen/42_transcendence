

export type CreateUserParams = {
	email: string,
	firstName: string,
	lastName: string,
	password: string
}	

export type User = {
	id: number;
	email: string;
	name: string
}

export type ConversationType = {
	id: number;
	name: string,
	lastMessage: string
}

export type MessagesType = {
	id: number;
	text: string;
	createdAt: string;
	author: User;
}

