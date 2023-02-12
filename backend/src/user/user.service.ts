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

	async	findUserById(id: number): Promise<User | undefined>
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			}
		})
		return user;
	}
	// async	findUserById(id: number): Promise<User | undefined>
	// {
	// 	return ;
	// }
	// async	findUserById(id: number): Promise<User | undefined>
	// {
	// 	return ;
	// }
	// async	findUserById(id: number): Promise<User | undefined>
	// {
	// 	return ;
	// }
}
