import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './auth.service';
import { AtSrategy, RtSrategy } from './strategies';
import { strategy42 } from './strategies/42';
import { Auth42Controller } from './controllers/auth42.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController, Auth42Controller],
  providers: [AuthService, AtSrategy, RtSrategy, strategy42]
})
export class AuthModule {}
