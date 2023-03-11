import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Two_FA_Guard } from 'src/two_fa/guard/two_fa.guard';
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
		console.log("hello from inside test42");
		return ("hello");
	}

	@UseGuards(Jwt_Auth_Guard)
	@Get('testjwt')
	weirdos()
	{
		console.log("hello from inside testjwt");
		return ("hello");
	}
	
	@UseGuards(Intra_42_Guard)
	@Get('login')
	async	intra_login(@Req() req: any, @Res() res: any): Promise<any>
	{
		console.log("hello from inside auth/login");
		await this.authService.login(req, res);
	}

	@Get('test-all')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	random()
	{
		console.log("hello from inside test all")
		return ("hello");
	}
	
	@Get('all_online')
	async yep(): Promise<any>
	{
		const smth = await this.authService.get_all_logged_in();
		console.log("this is smth");
		console.log(smth);
		return (smth);
	}

	@Get('test_db')
	test_db()
	{
		console.log("hello from inside test_db")
		this.authService.test_db();
		return ("successfully tested db");
	}
}
