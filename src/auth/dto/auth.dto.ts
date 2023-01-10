import { IsNotEmpty, IsNumber, IsString, IsEmail, IsUrl, IsBoolean } from "class-validator";

export class AuthDto {
	@IsNotEmpty()
	@IsString()
	email: string;
	
	@IsNotEmpty()
	@IsString()
	password: string;
}

export class Auth42Dto {
	@IsNumber()
	@IsNotEmpty()
	id: number;
	
	@IsEmail()
	@IsNotEmpty()
	@IsString()
	email: string;
	
	@IsNotEmpty()
	@IsString()
	intra: string;
	
	@IsNotEmpty()
	@IsString()
	firstname: string;
	
	@IsNotEmpty()
	@IsString()
	lastname: string;
	
	@IsNotEmpty()
	@IsString()
	username: string;
	
	// @IsNotEmpty()
	// @IsString()
	// title: string[];
	
	// @IsUrl()
	// @IsNotEmpty()
	// @IsString()
	// picture: string;
	
	// @IsNotEmpty()
	// @IsString()
	// default_picture?: string;
	
	// @IsNotEmpty()
	// @IsString()
	// campus: string;
	
	// @IsNotEmpty()
	// @IsString()
	// country: string;
	
	// @IsNotEmpty()
	// @IsString()
	// coalition: string;
  
	// @IsBoolean()
	// twoFAEnable: boolean;
}