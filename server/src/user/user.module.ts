import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService, UsersOnline } from './user.service';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, PrismaService, UsersOnline],
  exports: [UserService, UsersOnline],
  controllers: [UserController]
})
export class UserModule {}
