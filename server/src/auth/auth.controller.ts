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
		////console.log("hello from inside test42");
		return ("hello");
	}

	@UseGuards(Jwt_Auth_Guard)
	@Get('testjwt')
	weirdos()
	{
		////console.log("hello from inside testjwt");
		return ("hello");
	}

	@UseGuards(Intra_42_Guard)
	@Get('login')
	async	intra_login(@Req() req: any, @Res() res: any): Promise<any>
	{
		////console.log("hello from inside auth/login");
		await this.authService.login(req, res);
	}

	@Get('test-all')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	random()
	{
		////console.log("hello from inside test all")
		return ("hello");
	}

	@Get('get_id')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	async get_id(@Req() req: any)
	{
		return (req.user.id);
	}

	@Get('create_test_user')
	async create_test_user()
	{
		////console.log("hello from inside create_test_user")
		await this.authService.create_test_user();
		return ("successfully tested db");
	}

	@Get('login_test_user')
	async login_test_user(@Res() res: any)
	{
		////console.log("hello from inside login_test_user")
		return this.authService.login_test_user(322, res);
		// return ("successfully tested db");
	}

	@Get('token_test_user')
	async get_token_test_user(@Res() res: any)
	{
		//console.log("hello from inside login_test_user")
		return this.authService.get_token_test_user(322, res);
		// return ("successfully tested db");
	}


}
