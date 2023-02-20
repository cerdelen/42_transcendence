import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleDestroy, OnModuleInit
{
	constructor(){
		super({
			datasources:{
				backend_database: {
					url: 'postgresql://user:password123@localhost:5434/backend_db?schema=public'
				}
			}
		})
	}


	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}

}
