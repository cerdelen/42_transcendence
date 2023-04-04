import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Services } from 'src/utils/consts';
import { PrismaModule } from '../prisma/prisma.module';
import { userGateway } from './userSocket/user.gateway';

@Module({
  imports: [PrismaModule],
  providers: [
    {provide: Services.USERS,useClass: UserService}, userGateway
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UserService
    }
  ],
  controllers: [UserController]
})
export class UserModule {}
