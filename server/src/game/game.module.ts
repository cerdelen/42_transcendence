import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { GameController } from './game.controller';

@Module({
  providers: [GameGateway, GameService, PrismaService, UserService],
  controllers: [GameController]
})
export class GameModule {}