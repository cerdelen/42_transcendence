import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindUserParams, UserWhereUniqueInput } from '../utils/types';
import { AuthUser } from '../utils/decorators';
import { use } from 'passport';
// import { FindUserParams } from 'src/utils/types';

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

	async	findUserById(id: number): Promise<User>
	{
		const user = await  this.prisma.user.findUnique({
			where: {
				id: Number(id)
			},
				// id: typeof id === "number" ? id : Number.parseInt(id),
				// name: findParams.name,
				// id: typeof findParams.id === "number" ? findParams.id : Number.parseInt(findParams.id)
				// name: findParams.name, 
				// chatPtsId: 2
			// select: {
			// 	id: true,
			// 	name: true,
			// 	mail: true,
			// 	chatPtsId: true,
			// 	two_FA_enabled: true,
			// 	two_FA_secret: true,
			// 	chatParticipant: {
			// 		select: {
			// 			userId: true,
			// 		} 
			// 	}
			// },
		});
		// console.log("user = " + user);
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
	async saveUser(user: User) {
		return user;
	}

	async findExistingUsers(user: UserWhereUniqueInput) : Promise<User[]> {
		const existingUser = await this.prisma.user.findMany({
			where: {
				
			}
		})
		console.log("findExisitngUSer = " + existingUser);
		
		return existingUser;
	}


}

