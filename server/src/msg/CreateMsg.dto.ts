import { IsNotEmpty, IsString, IsNumber, IsDate, isNumber, IsOptional } from 'class-validator';
import { User } from '@prisma/client';


export class CreateMsgDto {
	@IsNotEmpty()
	@IsString()
	text: string;


	@IsNotEmpty()
	@IsNumber()
	author: number; 

	@IsNotEmpty()
	@IsNumber()
	conversation_id: number; 

	@IsNotEmpty()
	@IsNumber()
	@IsOptional()
	created_at: number | Date
}



 