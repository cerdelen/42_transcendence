import { IsNotEmpty, IsString, IsNumber, IsDate, isNumber } from 'class-validator';


export class CreateMsgDto {
	@IsNotEmpty()
	@IsString()
	text: string;


	@IsNotEmpty()
	@IsNumber()
	user_id: number; 

	@IsNotEmpty()
	@IsNumber()
	conversation_id: number; 

	@IsNotEmpty()
	@IsNumber()
	created_at: number | Date
}



 