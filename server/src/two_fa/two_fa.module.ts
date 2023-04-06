import { Module } from '@nestjs/common';
import { TwoFaService } from './two_fa.service';
import { TwoFaController } from './two_fa.controller';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { New_user_gateway } from 'src/user/userSocket/new_userr_gatewat';

@Module({
  imports: [UserModule],
  providers: [TwoFaService, JwtService, AuthService, PrismaService, UserService, New_user_gateway],
  controllers: [TwoFaController],
  exports: [TwoFaService]
})
export class TwoFaModule {}