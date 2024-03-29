import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Intra42Strategy } from './strategies/intra.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Two_FA_Strategy } from 'src/two_fa/strategy/two_fa.strategy';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { new_user_gateway_module } from 'src/user/userSocket/new_user.gateway.module';


@Module({
  imports: [new_user_gateway_module, PrismaModule, UserModule, JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('secret')
    })
  })],
  controllers: [AuthController],
  providers: [AuthService, Intra42Strategy, JwtStrategy, Two_FA_Strategy, UserService],
  exports: [AuthService]
})
export class AuthModule { }
