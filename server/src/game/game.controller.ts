import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Jwt_Auth_Guard } from 'src/auth/guards/jwt_auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game.service';

@Controller('game')
export class GameController
{
	constructor(
		private readonly gameService: GameService,
	) {}


	@UseGuards(Jwt_Auth_Guard)
	@Post('many_games_data')
	async	get_may_games_data(@Body('game_ids') game_ids: number[])
	{
		return (this.gameService.get_many_games(game_ids));
	}

	@UseGuards(Jwt_Auth_Guard)
	@Get('game_data/:game_id')
	async	get_game_data(@Param('game_id') game_id)
	{
		if (!Number.isNaN(Number(game_id)))
		{	
			return (this.gameService.get_one_game(Number(game_id)));
		}
		return ({});
	}
}