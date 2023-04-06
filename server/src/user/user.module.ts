import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Services } from 'src/utils/consts';
import { PrismaModule } from '../prisma/prisma.module';
import { forwardRef } from '@nestjs/common';
import { new_user_gateway_module } from './userSocket/new_user.gateway.module';
import { New_user_gateway } from './userSocket/new_userr_gatewat';


@Module({
  imports: [PrismaModule],
  providers: [
    {provide: Services.USERS,useClass: UserService}, New_user_gateway
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UserService
    }
  ],
  controllers: [UserController]
})
export class UserModule {

static forRoot(): any {
    return {
      module: UserModule,
      providers: [
        {
          provide: new_user_gateway_module,
          useValue: new new_user_gateway_module(),
        },
        UserService,
      ],
      exports: [UserService],
    };
  }
}