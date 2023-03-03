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
		// return this.prisma.user.create({
		// 	data: {
				
		// 		stats: {
		// 			create:{}
		// 		}
		// 	},
		// })
		const _user = await this.prisma.user.create({data,})
		// const user_id = user.id;
		const _stats = await this.prisma.stats.create({
			data: {
				stat_id: data.id,
			}
		});
		// this.prisma.user.update({
		// 	where: {
		// 		id: user.id,
		// 	},
		// 	data: {
		// 		stats: _stats
		// 	}
		// })
		return _user;
		// return this.prisma.user.create({data,});
	}

	async	deleteUser(where: Prisma.UserCreateInput)
	{
		return this.prisma.user.delete({where});
	}

	async	findUserById(id: number): Promise<User | undefined>
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
