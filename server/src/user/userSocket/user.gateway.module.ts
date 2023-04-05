import { Module } from '@nestjs/common';
import { userGateway } from './user.gateway';

import { UserModule } from '../user.module';
import { UserService } from '../user.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UserModule, PrismaModule],
  providers: [userGateway, UserService]
})
export class UserGatewayModule {}
