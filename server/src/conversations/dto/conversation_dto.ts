import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class getMsgsByConversationIdDto {
	@IsNumber({allowNaN: false}, {each: true})
	@IsArray()
	conversationId: number[];

	// @IsNumber()
	// @IsNotEmpty()
	// chatId: number;

	// @IsString()
	// @IsNotEmpty()
	// message: string;
}