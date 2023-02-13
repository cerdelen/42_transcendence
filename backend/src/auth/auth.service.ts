import { Injectable, Req, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService 
{
	constructor(
			// private prisma: PrismaService,
			private userService: UserService,
			private jwtService: JwtService
	) {}


	async	login(@Req() req: any, @Res() res: any) : Promise<any> 
	{
		var user = await this.userService.findUserById(req.user.id);
		// i guess if 2 factor here

		const jwt_payload = {
			username: req.user.name,
			sub: req.user.id,
			mail: req.user.mail
		}
		const token = this.jwtService.sign(jwt_payload);
		res.cookie('accessToken', token);
		return res.redirect('http://localhost:3000/');
	}


	async validateUser(id: number, username : string, email : string): Promise<User>
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
}
