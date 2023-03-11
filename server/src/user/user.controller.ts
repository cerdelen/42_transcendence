import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Jwt_Auth_Guard } from 'src/auth/guards/jwt_auth.guard';
import { UserService, UsersOnline } from './user.service';

@Controller('user')
export class UserController
{
	constructor(
		private userService: UserService,
		private usersOnline: UsersOnline
	) {}

	@Post('change_name')
	@UseGuards(Jwt_Auth_Guard)
	async	change_name(@Req() req: any, @Body('new_name') _name : string) : Promise<any>
	{
		return (await	this.userService.updateUser({
			where: { id: req.user.id }, 
			data: { name: _name },
		}));
	}

	@Get('all_online')
	yep()
	{
		return this.usersOnline.get_all_logged_in();
	}
}
