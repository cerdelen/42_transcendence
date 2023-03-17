import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConversationDto {
	@IsNumber()
	@IsNotEmpty()
	authorId: number;

	@IsNumber()
	@IsNotEmpty()
	recipientId: number;

	@IsString()
	@IsNotEmpty()
	message: string;


}
//   id: number
//   chat_name: string | null
//   is_public: boolean
//   pass_protected: boolean
//   password: string | null
//   chat_members: number[]
//   chat_owner: number
//   chat_admins: number[]
//   black_list: number[]
//   mute_list: number[]
