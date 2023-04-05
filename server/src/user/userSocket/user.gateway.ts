import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UserService } from '../user.service';
import { Inject, forwardRef } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';

@WebSocketGateway((
	{
	  cors: {
		origin: '*',
	  },
	}
))
export class userGateway implements OnGatewayConnection, OnGatewayDisconnect
{
	constructor ( private readonly userService: UserService) {}
	private online_users: number [] = [];

	handleConnection(client: any, ...args: any[])
	{
		// this.online_users.push(client);
		// console.log(client);
		
		// this.server.emit("online users update", this.get_online_users());
	}
	async handleDisconnect(client: any) {
		console.log("someone is disconnecting ");
		const user_id = await this.userService.find_user_by_sock_id(client.id);
		if(user_id != undefined)
		{
			this.userService.reset_sock_id(user_id);
			// this.online_users.filter(c => c !== user_id);
			const idx = this.online_users.indexOf(user_id);
			this.online_users.splice(idx, 1);
			this.server.emit("online users update", this.get_online_users());
		}
	}

	get_online_users()
	{
		return ( this.online_users)
	}

	@WebSocketServer()
	server;
	onModuleInit() {
		console.log("constructed this usergateway (only for online/offline status)");
	}

	@SubscribeMessage('online_inform')
	async init_online_array(@MessageBody() data: any, @ConnectedSocket() client)
	{
		console.log("init_socket_online" + data);
		if (!(Number.isNaN(Number(data))))
		{
			if (!this.online_users.includes(Number(data)))
			{
				this.userService.set_user_socket_id(Number(data), client.id)
				this.online_users.push(Number(data));
				console.log(JSON.stringify(this.online_users));
				this.server.emit("online users update", this.get_online_users());
			}
		}
	}


	@SubscribeMessage('logging out')
	async someone_logged_out(@ConnectedSocket() client)
	{
		console.log("someone pressed logout");
		const user_id = await this.userService.find_user_by_sock_id(client.id);
		if(user_id != undefined)
		{
			console.log("and we got into if " + user_id);
			this.userService.reset_sock_id(user_id);
			console.log("array before filter " + JSON.stringify(this.online_users));
			const idx = this.online_users.indexOf(user_id);
			this.online_users.splice(idx, 1);

			// this.online_users.filter(c => c !== user_id);
			console.log("remaining array " + JSON.stringify(this.online_users));
			
			this.server.emit("online users update", this.get_online_users());
		}
	}
	// @SubscribeMessage('block_user')
	// async block_user(@MessageBody() data: any)
	// {
	// 	console.log("block user called");
		
	// 	await this.userService.block_user(data.user_id, data.user_to_block);
	// }
	
	// @SubscribeMessage('unblock_user')
	// async unblock_user(@MessageBody() data: any)
	// {
	// 	await this.userService.unblock_user(data.user_id, data.user_to_unblock);
	// }
}
