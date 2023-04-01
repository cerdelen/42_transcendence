import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TwoFaModule } from './two_fa/two_fa.module';
import { PicturesModule } from './pictures/pictures.module';
// import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';
import { ConversationModule } from './conversations/conversations.module';
// import { ParticipantsModule } from './participants/participants.module';
import { ConversationService } from './conversations/conversations.service';
import { UserService } from './user/user.service';
import { MsgModule } from './msg/msg.module';
import { MsgService } from './msg/msg.service';
import { GatewayModule } from './gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';
// import * as dotenv from 'dotenv';
import { config } from './config';

// dotenv.config();


@Module({
	// imports: [AuthModule, PrismaModule, UserModule, TwoFaModule, PicturesModule, ChatModule],
	imports: [ConfigModule.forRoot({
		isGlobal: true,
		load: [config],
		envFilePath: '.env'
		// envFilePath: '.env'		
	}), AuthModule, PrismaModule, UserModule, TwoFaModule, PicturesModule, MsgModule, ConversationModule, GatewayModule, EventEmitterModule, GameModule],
	controllers: [AppController],
	providers: [AppService, UserService],
})
export class AppModule {}
