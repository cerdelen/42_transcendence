42_transcendence
Frontend == client React 80 or 3000 from the outside

Backend == server Nest 3003 Postgres 5432

Prisma studio (database visualize) == 5555

If it's the first time it's run "cd client && npm i && cd ../server && npm i"

to Run docker-compose --file docker-compose-dev.yml up

to start prisma studio:

        1. after docker-compose up (takes around 30 sec) run "docker ps"

        2. find process id of "server"

        3. run "docker exec -it [server process id] bash"

        4. (if you made changes to database run "npx prisma db push --accept-data-loss")

        5. run "npx prisma studio"

        6. go to browser and open "localhost:5555" (first time you open it it will sefault, repeat from step 5)


1. In case of Dummy user giving unautherized error use Postman to make a "Get" Request to "localhost:3003/auth/token_test_user"
2. either you have the token as a response or in the terminal
3. in file "client/src/components/loginpage.tsx" in funciton 	fakeLogin  change the hardcoded 'accessToken' in the JSCookies.set() funciton to the token found in step 2








import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindUserParams } from '../utils/types';
import { IUserService } from './user';

@Injectable()
export class UserService implements IUserService {
	constructor(
		private prisma: PrismaService
		) {}


	async	createUser(data: Prisma.UserCreateInput) : Promise<User>
	{
		return this.prisma.user.create({data,});
	}

	async	deleteUser(where: Prisma.UserCreateInput)
	{
		return this.prisma.user.delete({where});
	}

	async	findUserById(findUserParams: FindUserParams): Promise<User | undefined>
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id: findUserParams.id,
			},
			include: { ChatParticipant: true} 
		},)
		return user;
	} 

	async	updateUser(params:{
		where: Prisma.UserWhereUniqueInput,
		data: Prisma.UserUpdateInput,
	}) : Promise<User>
	{
		const { where, data } = params;
		return this.prisma.user.update({
			data,
			where,
		});
	}

	async	turn_on_2FA(user_id: number)
	{
		var	user = await this.findUserById({id: user_id});
		if(!user.two_FA_enabled)
		{
			await this.updateUser({
				where: {id: user_id},
				data: { two_FA_enabled: true },
			});
		}
	}

	async	turn_off_2FA(user_id: number)
	{
		var	user = await this.findUserById({id: user_id});
		if(user.two_FA_enabled)
		{
			await this.updateUser({
				where: {id: user_id},
				data: { two_FA_enabled: false },
			});
		}
	}
}







import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Services } from 'src/utils/consts';
import { PrismaModule } from '../prisma/prisma.module';
// import { Ser } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: Services.USERS,
      useClass: UserService
    }
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










import { Body, Controller, Post, Req, UseGuards, Inject } from '@nestjs/common';
import { Jwt_Auth_Guard } from 'src/auth/guards/jwt_auth.guard';
import { UserService } from './user.service';
import { Routes, Services } from '../utils/consts';
import { IUserService } from './user';

@Controller(Routes.USERS)
export class UserController
{
	constructor(
		@Inject(Services.USERS) private readonly userService: IUserService,
	) {}

	@Post('change_name')
	@UseGuards(Jwt_Auth_Guard)
	async	change_name(@Req() req: any, @Body('new_name') _name : string) : Promise<any>
	{
		return (await	this.userService.updateUser({
			where: { id: req.user.id }, 
			data: { name: _name },
		}));
	}
}




