import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService
		) {}


	async	createUser(data: Prisma.UserCreateInput) : Promise<User>
	{
		return this.prisma.user.create({data,});
	}

	async	deleteUser(where: Prisma.UserCreateInput)
	{
		return this.prisma.user.delete({where});
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
}
