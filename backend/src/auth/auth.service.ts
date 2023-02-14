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
		if(user.two_FA_enabled)
		{
			return _res.redirect('http://localhost:3000/?2-fa=' + String(_req.user.id));
		}
		const jwt_payload = {
			username: _req.user.name,
			sub: _req.user.id,
			mail: _req.user.mail
		}
		const token = this.jwtService.sign(jwt_payload, {secret: "jwtSecret"});
		_res.cookie('accessToken', token);
		return _res.redirect('http://localhost:3000/');
	}


	async validate_intra_user(id: number, username : string, email : string): Promise<User>
	{
		console.log(email);
		const user = await this.userService.findUserById(id);
		if (user)
			return (user);
		else
		{

			const user = this.userService.createUser({
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
}
