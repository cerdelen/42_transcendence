export type displayed_chat_class =
{
	conversation_id : number;
	conversation_name?: string;
	conversation_msg_arr?: any[];
	conversation_created_at?: any;
	conversation?: boolean;
	conversation_is_public?: boolean;
	conversation_pass_protected?: boolean;
	conversation_password?: string;		
	conversation_participant_arr?: number[];
	conversation_owner_arr?: number[];
	conversation_admin_arr?: number[];
	conversation_black_list_arr?: number[];
	conversation_mute_list_arr?: number[];
	group_chat?: boolean;



	// has_password?: boolean;
	// participants?: number[];
	// owner?: number;
	// admins?: number[];
	// banned?: number[];
	// mute_list?: number[];
}

// conversation_id					Int					@unique  @id @default(autoincrement()) 
// 	conversation_name				String?					
// 	conversation_msg_arr			Message[]
// 	conversation_created_at			DateTime			@default(now())
// 	// chat_participants	ChatParticipant[]
// 	conversation					Boolean				@default(true)
// 	//something to consider later after creating chat
// 	conversation_is_public			Boolean		@default(true)
// 	conversation_pass_protected		Boolean		@default(false)
// 	conversation_password			String?		

// 	conversation_participant_arr	Int[]		@default([])
// 	conversation_owner_arr			Int[]
// 	conversation_admin_arr			Int[] 
// 	conversation_black_list_arr		Int[]
// 	conversation_mute_list_arr		Int[]

// 	//sorry but i gotta do this
// 	group_chat						Boolean		@default(false)

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

