import { Injectable } from '@nestjs/common';
import { User, Prisma, Stats } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWhereUniqueInput } from '../utils/types';
import { New_user_gateway } from './userSocket/new_userr_gatewat';
import { userGateway } from './userSocket/user.gateway';

@Injectable()
export class UserService {
	
	constructor(
		private prisma: PrismaService,
		private readonly new_user_gatewaysss: New_user_gateway,
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
			this.new_user_gatewaysss.emit_new_user(data.id.toString());
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
		const user = await  this.prisma.user.findUnique({
			where: {
				id: Number(id)
			},
		});
		return user;
	} 

	async	findUserByName(_name: string) : Promise<User | undefined>
	{
		const user = await  this.prisma.user.findUnique({
			where: {
				name: _name
			},
		});
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
		const	index_2 = add_friend.friendlist.findIndex(x => x == friend);

		if(add_friend && user && index == -1)
		{
			user.friendlist.push(friend);
			add_friend.friendlist.push(userId);
			await	this.prisma.user.update({where: { id: userId}, data: { friendlist: user.friendlist}});
			await	this.prisma.user.update({where: { id: friend}, data: { friendlist: add_friend.friendlist}});
		}
	}

	async	send_friend_request(userId: number, friend: number)
	{
		const	user = await this.prisma.user.findUnique({ where : { id: userId }});				//me
		const	user_two = await this.prisma.user.findUnique({ where : { id: friend }});			//target

		if(user_two && user)
		{
			if (user.friendlist.includes(friend) && user_two.friendlist.includes(friend))
			{
					return ;
			}
			if(user.incoming_friend_req.includes(friend) && user_two.outgoing_friend_req.includes(userId))		// in case the other one sent me alreadt friend invite
			{
				//// console.log("got into exeption where there is already f_r sent the other way around");
				return (this.accept_friend_request(friend, userId));
			}
			if (!user.outgoing_friend_req.includes(friend))
				user.outgoing_friend_req.push(friend);
			if (!user_two.incoming_friend_req.includes(userId))
				user_two.incoming_friend_req.push(userId);
			await	this.prisma.user.update({
				where: { id: userId},
				data: {
					outgoing_friend_req: user.outgoing_friend_req
				}});
			await	this.prisma.user.update({
				where: { id: friend},
				data: {
					incoming_friend_req: user_two.incoming_friend_req
				}});
				this.new_user_gatewaysss.new_friend_request_received(friend, userId);
		}
	}

	async	accept_friend_request(userId: number, friend: number)
	{
		const	user = await this.prisma.user.findUnique({ where : { id: userId }});
		const	user_two = await this.prisma.user.findUnique({ where : { id: friend }});

		if(user_two && user)
		{
				const	incoming_request_indx = user.incoming_friend_req.findIndex(x => x == friend);
				const	outgoing_req_user_one_idx = user.outgoing_friend_req.findIndex(x => x == friend);
				const	outgoing_request_idx = user_two.outgoing_friend_req.findIndex(x => x == userId);
				const	incoming_req_user_two_idx = user_two.incoming_friend_req.findIndex(x => x == userId);
				if (incoming_request_indx != -1)
				{
					user.incoming_friend_req.splice(incoming_request_indx, 1);
				}
				if (outgoing_req_user_one_idx != -1)
				{
					user.outgoing_friend_req.splice(outgoing_req_user_one_idx, 1);
				}
				if (outgoing_request_idx != -1)
				{
					user_two.outgoing_friend_req.splice(outgoing_request_idx, 1);
				}
				if (incoming_req_user_two_idx != -1)
				{
					user_two.incoming_friend_req.splice(incoming_req_user_two_idx, 1);
				}
				if (!user.friendlist.includes(friend))
					user.friendlist.push(friend);
				if (!user_two.friendlist.includes(userId))
					user_two.friendlist.push(userId);
				await	this.prisma.user.update({
					where: { id: userId}, 
					data: {
						friendlist: user.friendlist, 
						incoming_friend_req: user.incoming_friend_req,
						outgoing_friend_req: user.outgoing_friend_req
				}});
				await	this.prisma.user.update({
					where: { id: friend},
					data: {
						friendlist: user_two.friendlist,
						outgoing_friend_req: user_two.outgoing_friend_req,
						incoming_friend_req: user_two.incoming_friend_req
				}});
				// console.log("in front of newfriend request gateway function");
				this.new_user_gatewaysss.new_friend_accepted(userId, friend);
		}
	}

	async	remove_friend_request(userId: number, friend: number)
	{
		const	user_one = await this.prisma.user.findUnique({ where : { id: userId }});
		const	user_two = await this.prisma.user.findUnique({ where : { id: friend }});

		if(user_two && user_one)
		{	
			const	incoming_request_user_one_idx = user_one.incoming_friend_req.findIndex(x => x == friend);
			const	incoming_request_user_two_idx = user_two.incoming_friend_req.findIndex(x => x == userId);
			const	outgoing_request_user_one_idx = user_one.outgoing_friend_req.findIndex(x => x == friend);
			const	outgoing_request_user_two_idx = user_two.outgoing_friend_req.findIndex(x => x == userId);
			if (incoming_request_user_one_idx != -1)
				user_one.incoming_friend_req.splice(incoming_request_user_one_idx, 1);
			if (incoming_request_user_two_idx != -1)
				user_two.incoming_friend_req.splice(incoming_request_user_two_idx, 1);
			if (outgoing_request_user_one_idx != -1)
				user_one.outgoing_friend_req.splice(outgoing_request_user_one_idx, 1);
			if (outgoing_request_user_two_idx != -1)
				user_two.outgoing_friend_req.splice(outgoing_request_user_two_idx, 1);

			await	this.prisma.user.update({
				where: { id: userId}, 
				data: {
					incoming_friend_req: user_one.incoming_friend_req,
					outgoing_friend_req: user_one.outgoing_friend_req
				}});
			await	this.prisma.user.update({
				where: { id: friend},
				data: {
					incoming_friend_req: user_two.incoming_friend_req,
					outgoing_friend_req: user_two.outgoing_friend_req
				}});
			this.new_user_gatewaysss.delete_friend_request(userId, friend);
		}
	}
	
	async	rmv_friend(userId: number, friend: number)
	{
		const	user = await this.prisma.user.findUnique({ where : { id: userId }});
		const	rmv_friend = await this.prisma.user.findUnique({ where : { id: friend }});
		const	index = user.friendlist.findIndex(x => x == friend);
		const	index_2 = rmv_friend.friendlist.findIndex(x => x == userId);
		
		if(rmv_friend && user && index != -1)
		{
			user.friendlist.splice(index, 1);
			rmv_friend.friendlist.splice(index_2, 1);
			await	this.prisma.user.update({where: { id: userId}, data: { friendlist: user.friendlist}});
			await	this.prisma.user.update({where: { id: friend}, data: { friendlist: rmv_friend.friendlist}});
			this.new_user_gatewaysss.remove_friend(userId, friend);
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
		if(user_id){}
		var stats = await this.prisma.stats.findUnique({where: {stat_id: user_id}});
		if(stats)
		{
			if (stats.wins == 2)
			{
				await this.add_achievement(user_id, 0)
			}
			if (stats.mmr >= 1600)
			{
				// console.log("this is weird this shold add achievement");
				
				await this.add_achievement(user_id, 1)
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
					loses: stats.loses + 1,
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
		// ////// console.log(game.player_one + " " + game.player_two);
		
		const	game		= await this.prisma.game.findUnique({ where: { id: game_id }});
		const	user_one	= await this.prisma.user.findUnique({ where: { id: game.player_one } });
		const	user_two	= await this.prisma.user.findUnique({ where: { id: game.player_two } });
		// console.log('this is game' + JSON.stringify(game));

		let index_one;
		let index_two;
		if (!user_one || !user_two)
		{
			// console.log("user one or user 2 is undefined");
			return ;
		}
		////// console.log("user one or user 2");
		////// console.log("user 1 " + user_one);
		////// console.log("user 2 " + user_two);
		if(!user_one.games == null)
			index_one = user_one.games.findIndex(x => x == game.id);
		else
			index_one = -1;
		if(!user_two.games == null)
			index_two = user_two.games.findIndex(x => x == game.id);
		else
			index_two = -1;
		////// console.log("this is user one" + JSON.stringify(user_one));
		////// console.log("this is user two" + JSON.stringify(user_two));
		////// console.log("this is index 1" + index_one);
		////// console.log("this is index 2" + index_two);
		// console.log("Addign win and lose ran ", game.winner, " and ", game.loser);
		if(user_two && user_one && index_one == -1 && index_two == -1)
		{
			await	this.add_loss(game.loser);
			await	this.add_win(game.winner);
			
			if(game.score_one == 0 || game.score_two == 0 && !(game.score_one == 0 && game.score_two == 0))
				this.add_achievement(game.winner, 2);
			await	user_one.games.push(game.id);
			await	user_two.games.push(game.id);
			await	this.prisma.user.update({where: { id: user_one.id}, data: { games: user_one.games}});
			await	this.prisma.user.update({where: { id: user_two.id}, data: { games: user_two.games}});
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
	async saveUser(user: User) {
		return user;
	}

	async findExistingUsers(user: UserWhereUniqueInput) : Promise<User[]> {
		const existingUser = await this.prisma.user.findMany({
			where: {
				
			}
		})
		////// console.log("findExisitngUSer = " + existingUser);
		
		return existingUser;
	}

	async	get_user_data(user_id: number) : Promise<User>
	{
		return (this.prisma.user.findUnique({where: { id: user_id }}));
	}
	
	async	get_user_stats(user_id: number) : Promise<Stats>
	{
		return (this.prisma.stats.findUnique({where: { stat_id: user_id }}));
	}

	async	get_user_name(user_id: number) : Promise<String>
	{
		const user = await this.prisma.user.findUnique({where: {id: user_id}});
		return user.name;
	}

	async	change_name(user_id: number, _name: string) : Promise<boolean>
	{
		const	user = await this.prisma.user.findUnique({where: { name: _name }});
		if (!user)

		{
			await	this.prisma.user.update({
				where: { id: user_id }, 
				data: { name: _name },
			});
			return (true);
		}
		return (false);
	}

	async	get_all_other_user_ids(userId: number)
	{
		const users = await this.prisma.user.findMany({
			where: {
				NOT: {
					id: userId
				}
			}
		});
		let arr : number [] = []
		for(let i = 0; i < users.length; i++)
		{
			arr.push(users[i].id);
		}
		return (arr)
	}

	async get_user_socket_id(user_id: number)
	{
		const user = await this.prisma.user.findUnique({where: {id: user_id}});

		return (user.socketId);
	}

	async find_user_by_sock_id(sock_id: string)
	{
		const user = await this.prisma.user.findMany({where: {socketId: sock_id}});

		if(user.length > 0)
			return (user[0].id);
		return (undefined)
	}

	async reset_sock_id(user_id: number)
	{
		await this.set_user_socket_id(user_id, "");
	}

	async set_user_socket_id(user_id: number, s_id: string)
	{
		return this.prisma.user.update({
			where: {id: user_id},
			data: {socketId: s_id}
		});
	}

	async get_user_online(user_id: number)
	{
		const user = await this.prisma.user.findUnique({where: {id: user_id}});

		return (user.online);
	}

	async set_user_online(user_id: number, state: boolean)
	{
		return this.prisma.user.update({
			where: {id: user_id}, 
			data: {online: state},
		});
	}

	async	block_user(user_id: number, user_to_block: number)
	{
		const user = await this.prisma.user.findUnique({where: { id: user_id }});

		if (!user)
			return ;
		const idx = user.blocked_users.indexOf(user_to_block)
		if (idx != -1)
			return ;

		user.blocked_users.push(user_to_block);
		
		await this.prisma.user.update({
			where: {id: user_id},
			data: { blocked_users: user.blocked_users}
		});
	}

	async	unblock_user(user_id: number, user_to_unblock: number)
	{
		const user = await this.prisma.user.findUnique({where: { id: user_id }});
		
		if (!user)
		return ;
		const idx = user.blocked_users.indexOf(user_to_unblock)
		if (idx == -1)
		return ;
		user.blocked_users.splice(idx, 1);
		await this.prisma.user.update({
			where: {id: user_id},
			data: { blocked_users: user.blocked_users}
		});
	}

	async	get_ladder()
	{
		const ladder : Stats [] = await this.prisma.stats.findMany({
			orderBy:[{mmr: 'desc'}],
		});
		let arr : {mmr: Number, name: String, userId: Number}[] = []
		for(let i = 0; i < ladder.length; i++)
		{
			arr.push({mmr: ladder[i].mmr, name: await this.get_user_name(ladder[i].stat_id), userId: ladder[i].stat_id});
		}
		return (arr);
	}

	async	get_all_user_ids()
	{
		return this.prisma.user.findMany({
			select: {
				id: true
			}
		})
	}

	async remove_conv_from_user(user_id: number, chat_id: number)
	{
		const user = await this.prisma.user.findUnique({where: {id: user_id}});
		if (!user) 
			return ;
		const idx = user.conversation_id_arr.indexOf(chat_id);
		if (idx != -1)
		{
			// console.log("remove conv from user in if with idx ", idx);
			// console.log("array before ", user.conversation_id_arr);
			
			user.conversation_id_arr.splice(idx, 1);
			// console.log("array after ", user.conversation_id_arr);
			await this.prisma.user.update({
				where: {id: user_id},
				data: {
					conversation_id_arr: user.conversation_id_arr,
				}
			})
		}
	}
}