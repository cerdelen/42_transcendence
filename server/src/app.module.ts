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

@Module({
	// imports: [AuthModule, PrismaModule, UserModule, TwoFaModule, PicturesModule, ChatModule],
	imports: [AuthModule, PrismaModule, UserModule, TwoFaModule, PicturesModule, MessagesModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
