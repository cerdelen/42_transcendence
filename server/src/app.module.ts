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
import { ConfigModule } from '@nestjs/config';
import { ConversationModule } from './conversations/conversations.module';
import { ParticipantsModule } from './participants/participants.module';


@Module({
	// imports: [AuthModule, PrismaModule, UserModule, TwoFaModule, PicturesModule, ChatModule],
	imports: [AuthModule, PrismaModule, UserModule, TwoFaModule, PicturesModule, MessagesModule, ConversationModule, ParticipantsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
