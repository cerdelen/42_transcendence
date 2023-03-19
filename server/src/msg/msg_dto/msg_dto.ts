import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class message_dto {
	@IsNumber()
	@IsNotEmpty()
	authorId: number;

	@IsNumber()
	@IsNotEmpty()
	chatId: number;

	@IsString()
	@IsNotEmpty()
	message: string;
}