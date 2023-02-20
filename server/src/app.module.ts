import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TwoFaModule } from './two_fa/two_fa.module';

@Module({
	imports: [AuthModule, PrismaModule, UserModule, TwoFaModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
