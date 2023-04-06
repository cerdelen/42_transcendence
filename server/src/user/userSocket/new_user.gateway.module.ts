import { Module } from '@nestjs/common';
import { userGateway } from './user.gateway';

import { UserModule } from '../user.module';
import { UserService } from '../user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { New_user_gateway } from './new_userr_gatewat';

@Module({
  providers: [New_user_gateway],
  exports: [New_user_gateway]
})
export class new_user_gateway_module {}
