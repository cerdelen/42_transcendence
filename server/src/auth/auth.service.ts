import { Injectable, Req, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService 
{
	constructor(
			// private prisma: PrismaService,
			private userService: UserService,
			private jwtService: JwtService
	) {}


	async	login(@Req() _req: any, @Res() _res: any) : Promise<any> 
	{
		var user = await this.userService.findUserById(_req.user.id);
		console.log(user.id);
		if(user.two_FA_enabled)
		{
			console.log("2fa enabled, redirecting to 2fa");
			return _res.redirect('http://localhost:3000/auth?2fa=' + String(_req.user.id));
		}
		console.log("2fa NOT enabled signing token");
		return (this.sign_42_jwt_token(user.id, _res));
	}

	async	sign_42_jwt_token(user_id: number, res: any, is_two_FAed = false)
	{
		console.log('sign_jwt_token');
		const	user	= await this.userService.findUserById(user_id);
		const	payload	= { name: user.name, sub: user.id, mail: user.mail, is_two_FAed: is_two_FAed };
		const	token	= this.jwtService.sign(payload, {secret: "generic secret"});
		res.cookie('accessToken', token);
		console.log('this is signed accessToken');
		console.log(token);
		res.redirect('http://localhost:3000/');
	}

	async	sign_jwt_token(user_id: number, res: any, is_two_FAed = false)
	{
		console.log('sign_jwt_token');
		const	user	= await this.userService.findUserById(user_id);
		const	payload	= { name: user.name, sub: user.id, mail: user.mail, is_two_FAed: is_two_FAed };
		const	token	= this.jwtService.sign(payload, {secret: "generic secret"});
		// res.clearCookie('accessToken');
		res.cookie('accessToken', token);
		// res.set('Authorization', 'Bearer ' + token);

	
		console.log('this is signed accessToken');
		console.log(token);
		// res.redirect('http://localhost:3000/');
		return(token);
	}

	async validate_intra_user(id: number, username : string, email : string): Promise<User>
	{
		console.log(email);
		const user = await this.userService.findUserById(id);
		if (user)
			return (user);
		else
		{

			const user = await this.userService.createUser({
				id: Number(id),
				name: username,
				mail: email
			});
			return (user);
		}
	}

	async validate_user(payload: any): Promise<User>
	{
		const id = payload.sub;
		
		try 
		{
			const user = await this.userService.findUserById(Number(id));
			if(!user)
				return (null);
			return (user);
		}
		catch (error)
		{
			return (null);
		}
	}

	async test_db()
	{
		const user = await this.userService.createUser({
			id: Number(322),
			name: 'testinguser',
			mail: 'testinguser@email.com'
		});
	}
}
