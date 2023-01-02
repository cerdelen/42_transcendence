import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';
import { UserController } from './user.controller';

@Module({
  controllers: [GameController, UserController]
})
export class UserModule {}
