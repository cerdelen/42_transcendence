import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor() {
        super({
            datasources: {
                db: {
                    url: 'postgresql://user:password@localhost:5434/transcDB?schema=public'
                },
            },
        });
    }

    async   onModuleInit() {
        await this.$connect();
    }

    async   onModuleDestroy() {
        await this.$disconnect();
    }
}
