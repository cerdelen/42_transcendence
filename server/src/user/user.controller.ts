import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Jwt_Auth_Guard } from 'src/auth/guards/jwt_auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController
{
	constructor(
		private userService: UserService
	) {}

	@Post('add_friend')
	@UseGuards(Jwt_Auth_Guard)
	async	add_friend(@Req() req: any, @Body('adding_you') adding_you: string)
	{
		if (!Number.isNaN(adding_you))
		{	
			this.userService.add_friend(req.user.id, Number(adding_you));
		}
	}
	
	@Put('remove_friend')
	@UseGuards(Jwt_Auth_Guard)
	async	removing_friend(@Req() req: any, @Body('removing_you') removing_you: string)
	{
		if (!Number.isNaN(removing_you))
		{	
			this.userService.rmv_friend(req.user.id, Number(removing_you));
		}
	}

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
