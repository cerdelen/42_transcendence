import { Body, Controller, Post, Req, UseGuards, Inject } from '@nestjs/common';
import { Jwt_Auth_Guard } from 'src/auth/guards/jwt_auth.guard';
import { UserService } from './user.service';
import { Routes, Services } from '../utils/consts';

@Controller(Routes.USERS)
export class UserController
{
	constructor(
		@Inject(Services.USERS) private readonly userService: UserService,
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
}
