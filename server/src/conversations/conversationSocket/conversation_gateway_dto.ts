import { IsNotEmpty, IsString, IsNumber} from 'class-validator';

export class conv_gateway_dto
{
	@IsNotEmpty()
	@IsNumber()
	chat_id: number;

	@IsNotEmpty()
	@IsString()
	userId: string;
}

