import { Injectable } from '@nestjs/common';
import { User, Prisma, Stats } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService
		) {}


	async	createUser(data: Prisma.UserCreateInput) : Promise<User>
	{
		const check = await this.prisma.user.findUnique({ where: { id: data.id }});
		if (!check)
		{
			const user = await this.prisma.user.create({data,});
			await this.prisma.stats.create({
				data: { stat_id: data.id },
			});
			return (user);
		}
		return (check);
	}
	
	async	deleteUser(where: Prisma.UserWhereUniqueInput)
	{
		const check = await this.prisma.user.findUnique({where});
		if (check)
		{
			await this.prisma.stats.delete({where: { stat_id: where.id}});
			return this.prisma.user.delete({where});
		}
	}

	async	findUserById(id: number) : Promise<User | undefined>
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id: Number(id),
			}
		})
		return user;
	}

	async	updateUser(params:{
		where: Prisma.UserWhereUniqueInput,
		data: Prisma.UserUpdateInput,
	}) : Promise<User>
	{
		const { where, data } = params;
		return this.prisma.user.update({
			data,
			where,
		});
	}

	async	update_stats(params:{
		where: Prisma.StatsWhereUniqueInput,
		data: Prisma.StatsUpdateInput,
	}) : Promise<Stats>
	{
		const { where, data } = params;
		return this.prisma.stats.update({
			data,
			where,
		});
	}

	async	add_friend(userId: number, friend: number)
	{
		const	user = await this.prisma.user.findUnique({ where : { id: userId }});
		const	add_friend = await this.prisma.user.findUnique({ where : { id: friend }});
		const	index = user.friendlist.findIndex(x => x == friend);
		// console.log(index);

		if(add_friend && user && index == -1)
		{
			await user.friendlist.push(friend);
			await	this.prisma.user.update({where: { id: userId}, data: { friendlist: user.friendlist}});
		}
	}

	async	rmv_friend(userId: number, friend: number)
	{
		// console.log(friend);
		const	user = await this.prisma.user.findUnique({ where : { id: userId }});
		const	rmv_friend = await this.prisma.user.findUnique({ where : { id: friend }});
		const	index = user.friendlist.findIndex(x => x == friend);
		
		if(rmv_friend && user && index != -1)
		{
			await user.friendlist.splice(index, 1);
			await	this.prisma.user.update({where: { id: userId}, data: { friendlist: user.friendlist}});
		}
	}

	async	turn_on_2FA(user_id: number)
	{
		var	user = await this.findUserById(user_id);
		if(!user.two_FA_enabled)
		{
			await this.updateUser({
				where: {id: user_id},
				data: { two_FA_enabled: true },
			});
		}
	}

	async	add_win(user_id: number)
	{
		var stats = await this.prisma.stats.findUnique({where: {stat_id: user_id}});
		if(stats)
		{
			if (stats.wins == 2)
			{
				this.add_achievement(user_id, 0)
			}
			if (stats.mmr >= 1685)
			{
				this.add_achievement(user_id, 1)
			}
			return (this.prisma.stats.update({
				where: { stat_id: user_id},
				data: {
					wins: stats.wins + 1,
					mmr: stats.mmr + 15
				}
			}));
		}
	}

	async	add_loss(user_id: number)
	{
		var stats = await this.prisma.stats.findUnique({where: {stat_id: user_id}});
		if(stats)
		{
			return (this.prisma.stats.update({
				where: { stat_id: user_id},
				data: {
					wins: stats.wins - 1,
					mmr: stats.mmr - 15
				}
			}));
		}
	}

	async	add_achievement(user_id: number, achiev_ind: number)
	{
		var stats = await this.prisma.stats.findUnique({where: {stat_id: user_id}});
		if (stats)
		{
			if (achiev_ind == 0)
			{
				return (this.prisma.stats.update({
					where: { stat_id: user_id},
					data: { achievement_0: true }
				}));
			}
			else if (achiev_ind == 1)
			{
				return (this.prisma.stats.update({
					where: { stat_id: user_id},
					data: { achievement_1: true }
				}));
			}
			else if (achiev_ind == 2)
			{
				return (this.prisma.stats.update({
					where: { stat_id: user_id},
					data: { achievement_2: true }
				}));
			}
		}
	}

	async	add_game_to_history(game_id: number)
	{
		const	game		= await this.prisma.game.findUnique({ where: { id: game_id }});
		const	user_one	= await this.prisma.user.findUnique({ where: { id: game.player_one } });
		const	user_two	= await this.prisma.user.findUnique({ where: { id: game.player_two } });

		const	index_one = user_one.games.findIndex(x => x == game.id);
		const	index_two = user_two.games.findIndex(x => x == game.id);
		if(user_two && user_one && index_one != -1 && index_two != -1)
		{
			await	this.add_loss(game.loser);
			await	this.add_win(game.winner);
			if(game.score_one == 0 || game.score_two == 0 && !(game.score_one == 0 && game.score_two == 0))
				this.add_achievement(game.winner, 2);
			await	user_one.games.push(game.id);
			await	user_two.games.push(game.id);
			await	this.prisma.user.update({where: { id: user_one.id}, data: { friendlist: user_one.games}});
			await	this.prisma.user.update({where: { id: user_two.id}, data: { friendlist: user_two.games}});
		}
	}

	async	turn_off_2FA(user_id: number)
	{
		var	user = await this.findUserById(user_id);
		if(user.two_FA_enabled)
		{
			await this.updateUser({
				where: {id: user_id},
				data: { two_FA_enabled: false },
			});
		}
	}

	async	get_user_data(user_id: number) : Promise<User>
	{
		return (this.prisma.user.findUnique({where: { id: user_id }}));
	}
	
	async	get_user_stats(user_id: number) : Promise<Stats>
	{
		return (this.prisma.stats.findUnique({where: { stat_id: user_id }}));
	}
}
