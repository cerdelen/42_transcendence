import { Module } from '@nestjs/common';
import { ChatController } from './chat/chat.controller';
import { GameController } from './game.controller';

@Module({
  controllers: [ChatController, GameController]
})
export class GameModule {}
