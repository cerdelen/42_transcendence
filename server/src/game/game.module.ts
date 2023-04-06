import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { new_user_gateway_module } from 'src/user/userSocket/new_user.gateway.module';

@Module({
  imports: [UserModule, new_user_gateway_module],
  providers: [GameGateway, GameService, PrismaService, UserService],
  controllers: [GameController]
})
export class GameModule {}