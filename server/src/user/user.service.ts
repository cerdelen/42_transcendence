import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersOnline {
	private loggedIn: Map<string, number>		// string socketId, nuber userId
	constructor()
	{
		this.loggedIn = new Map<string, number>();
	}

	get_all_logged_in()
	{
        return this.loggedIn.values();
    }
	
	add_user(socketID: string, userID: number)
	{
		this.loggedIn.set(socketID, userID);
	}

	update_user_id(socketID: string, userID: number)
	{
		this.loggedIn.set(socketID, userID);
	}

	get_user_id(socketID: string): number
	{
		return this.loggedIn.get(socketID);
	}

    delete_by_user_id(userID: number)
	{
        if (this.isUserOnline(userID))
		{
            let socketID: string;
            for (let item of this.loggedIn.keys())
			{
                if (this.loggedIn[item] === userID)
				{
                    socketID = item;
                    break;
                }
            }
            this.delete_by_socket_id(socketID);
        }
    }

    delete_by_socket_id(socketID: string)
	{
        this.loggedIn.delete(socketID);
    }


    isUserOnline(userID: number): boolean
	{
        for (let item of this.loggedIn.values())
		{
            if (item == userID)
			{
                return (true);
            }
        }
        return (false);
    }

}

@Injectable()
export class UserService {
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

	async	findUserById(id: number): Promise<User | undefined>
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id: Number(id),
			}
		})
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
		var	user = await this.findUserById(user_id);
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
		var	user = await this.findUserById(user_id);
		if(user.two_FA_enabled)
		{
			await this.updateUser({
				where: {id: user_id},
				data: { two_FA_enabled: false },
			});
		}
	}
}
