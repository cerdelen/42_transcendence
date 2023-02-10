import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService 
{
	constructor(
			private prisma: PrismaService
	) {}

	async adduser(username: string)
	{
		const User = await this.prisma.user.findUnique({
				where: {
					name: username,
				}
			});
		if (!User)
		{
			await this.prisma.user.create({
				data: {
					name: username,
				}
			});
		}
		else
		{
			console.log("this is the else!!!");
		}
	}

	async deleteuser(username: string)
	{
		await this.prisma.user.delete({
			where: {
				name: username,
			}
		});
	}
}
