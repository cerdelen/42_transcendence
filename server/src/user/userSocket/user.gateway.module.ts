import { Module } from '@nestjs/common';
import { userGateway } from './user.gateway';

import { UserModule } from '../user.module';
import { UserService } from '../user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { new_user_gateway_module } from './new_user.gateway.module';

@Module({
  imports: [UserModule, PrismaModule, new_user_gateway_module],
  providers: [userGateway, UserService]
})
export class UserGatewayModule {}
