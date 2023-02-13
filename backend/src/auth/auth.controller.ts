import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Intra_42_Guard } from './guards/intra_42.guard';
import { Jwt_Auth_Guard } from './guards/jwt_auth.guard';

@Controller('auth')
export class AuthController 
{
	constructor(private authService: AuthService) {}


	@UseGuards(Intra_42_Guard)
	@Get('test42')
	weirdo()
	{
		console.log("hello from inside");
		return "Hello";
	}

	@UseGuards(Jwt_Auth_Guard)
	@Get('testjwt')
	weirdos()
	{
		console.log("hello from inside");
		return "Hello";
	}

	@UseGuards(Intra_42_Guard)
	@Get('login')
	async	intra_login(@Req() req: any, @Res() res: any): Promise<any>
	{
		await this.authService.login(req, res);
	}


	// @Get('logout')
	// logout(): string 
	// {
	// 	this.authService.deleteuser("usernameveryintuitive");
	// 	return "Logout worked";
	// }
}
