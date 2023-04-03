import { Body, Controller, Get, Post, Put, Req, UseGuards, Inject, Param } from '@nestjs/common';
import { Jwt_Auth_Guard } from 'src/auth/guards/jwt_auth.guard';
import { Two_FA_Guard } from 'src/two_fa/guard/two_fa.guard';
import { UserService } from './user.service';
import { Routes, Services } from '../utils/consts';

@Controller('user')
export class UserController
{
	constructor(
		@Inject(Services.USERS) private readonly userService: UserService,
	) {}

	

	@Post('send_friend_request')
	@UseGuards(Jwt_Auth_Guard)
	async	send_friend_request(@Req() req: any, @Body('adding_you') adding_you: string)
	{
		console.log("alo sending f_r");
		if (!Number.isNaN(adding_you))
		{
			this.userService.send_friend_request(req.user.id, Number(adding_you));
		}
	}

	@Post('accept_friend_request')
	@UseGuards(Jwt_Auth_Guard)
	async	accept_friend_request(@Req() req: any, @Body('accepting_you') accepting_you: string)
	{
		console.log("alo accept f_r");
		if (!Number.isNaN(accepting_you))
		{
			this.userService.accept_friend_request(req.user.id, Number(accepting_you));
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

	@Get('del')
	@UseGuards(Jwt_Auth_Guard)
	async	del()
	{
		this.userService.deleteUser({id: 322});
	}

	@Get('add_win')
	@UseGuards(Jwt_Auth_Guard)
	async	add_win(@Req() req: any)
	{
		this.userService.add_win(req.user.id);
	}

	@Get('add_achievement')
	@UseGuards(Jwt_Auth_Guard)
	async	add_achie(@Req() req: any)
	{
		this.userService.add_achievement(req.user.id, 1);
	}

	@Post('change_name')
	@UseGuards(Jwt_Auth_Guard)
	async	change_name(@Req() req: any, @Body('new_name') _name : string) : Promise<boolean>
	{
		return (this.userService.change_name(req.user.id, _name));
	}

	@Post('get_id')
    @UseGuards(Jwt_Auth_Guard)
    @UseGuards(Two_FA_Guard)
    async get_id(@Req() req: any)
    {
		return (req.user.id);
    }

	@Post('user_data')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	async	get_user_data(@Body('user_id') user_id : string)
	{
		if(!Number.isNaN(user_id))
		{
			return (this.userService.get_user_data(Number(user_id)));
		}
	}
	
	@Post('user_stats')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	async	get_user_stats(@Body('user_id') user_id : string)
	{
		if(!Number.isNaN(user_id))
		{
			return (this.userService.get_user_stats(Number(user_id)));
		}
	}
	
	@Post('user_name')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	async	get_user_name(@Body('user_id') user_id : string)
	{
		//console.log(user_id);
		
		if(!Number.isNaN(Number(user_id)))
		{
			// const name = await this.userService.get_user_name(Number(user_id));
			return this.userService.get_user_name(Number(user_id));
		}
		//console.log("we newver got inside ");
		
	}
	
	@Get('get_all_other_user_ids')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	async	get_all_other_user_ids(@Req() req: any)
	{
		//console.log(req.user.id);
		
		return (this.userService.get_all_other_user_ids(req.user.id));
	}
	
	@Get('get_all_user_ids')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	async	name() {
		return (this.userService.get_all_user_ids());
	}
	
	@Get('get_ladder')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	async	get_ladder()
	{
		return (this.userService.get_ladder());
	}
	
	@Get('block_user/:other_user')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	async	block_user(@Param('other_user') other_user: number, @Req() _req: any)
	{
		//console.log("block user controller ");
		
		return this.userService.block_user(_req.user.id, Number(other_user));
	}
	
	@Get('unblock_user/:other_user')
	@UseGuards(Jwt_Auth_Guard)
	@UseGuards(Two_FA_Guard)
	async	unblock_user(@Param('other_user') other_user: number, @Req() _req: any)
	{
		//console.log("UNBLOCKblock user controller ");
		return this.userService.unblock_user(_req.user.id, Number(other_user));
	}
}
