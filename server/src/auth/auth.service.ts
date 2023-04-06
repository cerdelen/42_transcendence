import { Injectable, Req, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthService 
{
	constructor(
			private userService: UserService,
			private jwtService: JwtService,
			private configService: ConfigService
	) {}

	async	login(@Req() _req: any, @Res() _res: any) : Promise<any> 
	{
		var user = await this.userService.findUserById(_req.user.id);
		const	serv_ip = this.configService.get('serv_ip');
		if(user.two_FA_enabled)
		{
			return _res.redirect(`http://${serv_ip}:3000/auth?2fa=` + String(_req.user.id));
		}
		return (this.sign_42_jwt_token(user.id, _res));
	}

	async	login_test_user(test_user_id: number, @Res() _res: any) : Promise<any> 
	{
		var user = await this.userService.findUserById(test_user_id);
		const	serv_ip = this.configService.get('serv_ip');
		if(!user)
		await this.create_test_user();
		user = await this.userService.findUserById(test_user_id);
		if(user.two_FA_enabled)
		{
			return _res.redirect(`http://${serv_ip}:3000/auth?2fa=` + String(test_user_id));
		}
		return (this.sign_42_jwt_token_test_user(test_user_id, _res));
	}

	async	get_token_test_user(test_user_id: number, @Res() _res: any) : Promise<any> 
	{
		var user = await this.userService.findUserById(test_user_id);
		const	serv_ip = this.configService.get('serv_ip');
		if(!user)
		await this.create_test_user();
		user = await this.userService.findUserById(test_user_id);
		if(user.two_FA_enabled)
		{
			return _res.redirect(`http://${serv_ip}:3000/auth?2fa=` + String(test_user_id));
		}
		return (this.sign_42_jwt_token_test_user(test_user_id, _res));
	}

	async	sign_42_jwt_token_test_user(user_id: number, res: any, is_two_FAed = false)
	{
		const	user	= await this.userService.findUserById(user_id);
		const	payload	= { name: user.name, sub: user.id, mail: user.mail, is_two_FAed: is_two_FAed };
		const	token	= this.jwtService.sign(payload, {secret: this.configService.get('secret')});
		res.cookie('accessToken', token);
		return token;
	}

	async	sign_42_jwt_token(user_id: number, res: any, is_two_FAed = false)
	{
		const	serv_ip = this.configService.get('serv_ip');
		const	user	= await this.userService.findUserById(user_id);
		const	payload	= { name: user.name, sub: user.id, mail: user.mail, is_two_FAed: is_two_FAed };
		const	token	= this.jwtService.sign(payload, {secret: this.configService.get('secret')});
		res.cookie('accessToken', token);
		res.redirect(`http://${serv_ip}:3000/`);
	}

	async	sign_jwt_token(user_id: number, res: any, is_two_FAed = false)
	{
		const	user	= await this.userService.findUserById(user_id);
		const	payload	= { name: user.name, sub: user.id, mail: user.mail, is_two_FAed: is_two_FAed };
		const	token	= this.jwtService.sign(payload, {secret: this.configService.get('secret')});
		res.cookie('accessToken', token);
		return(token);
	}

	async validate_intra_user(id: number, username : string, email : string, socketId: string): Promise<User>
	{
		const user = await this.userService.findUserById(id);
		if (user)
			return (user);
		else
		{
			let user_2 = await this.userService.findUserByName(username);
			while(user_2)
			{
				user_2 = await this.userService.findUserByName(username);
				username = username + " ";
			}
			const user = await this.userService.createUser({
				id: Number(id),
				name: username,
				mail: email,
				socketId: socketId,
			});
			return (user); 
		}
	}

	async validate_user(payload: any): Promise<User>
	{
		const id = payload.sub;
		
		try 
		{
			const user = await this.userService.findUserById(id);
			if(!user)
				return (null);
			return (user);
		}
		catch (error)
		{
			return (null);
		}
	}

	async create_test_user()
	{
		const user = await this.userService.createUser({
			id: Number(322),
			name: 'testinguser',
			mail: 'testinguser@email.com',
			socketId: '321231321', //This might break stuff
		});
	}
}
