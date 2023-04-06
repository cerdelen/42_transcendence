import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TwoFaModule } from './two_fa/two_fa.module';
import { PicturesModule } from './pictures/pictures.module';
import { ConversationModule } from './conversations/conversations.module';
import { UserService } from './user/user.service';
import { MsgModule } from './msg/msg.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { UserGatewayModule } from './user/userSocket/user.gateway.module';
import { New_user_gateway } from './user/userSocket/new_userr_gatewat';
import { new_user_gateway_module } from './user/userSocket/new_user.gateway.module';

@Module({
	imports: [ConfigModule.forRoot({
		isGlobal: true,
		load: [config],
		envFilePath: '.env'
	}), UserModule.forRoot(),
	AuthModule, PrismaModule, TwoFaModule, PicturesModule, MsgModule, ConversationModule, EventEmitterModule, GameModule, UserGatewayModule],
	providers: [UserService, New_user_gateway],
})
export class AppModule {}
