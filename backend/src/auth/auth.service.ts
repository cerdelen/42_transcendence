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
		await this.prisma.user.create({
			data: {
				name: username
			}
		})
	}
}
