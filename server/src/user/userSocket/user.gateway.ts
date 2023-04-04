import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UserService } from '../user.service';


@WebSocketGateway((
	{
	  cors: {
		origin: '*',
	  },
	}
))
export class userGateway implements OnGatewayConnection, OnGatewayDisconnect
{
	constructor () {}
	private online_users: number [] = [];

	handleConnection(client: any, ...args: any[])
	{
		// this.online_users.push(client);
		// console.log(client);
		
		// this.server.emit("online users update", this.get_online_users());
	}
	handleDisconnect(client: any) {
		this.online_users.filter(c => c !== client);
		this.server.emit("online users update", this.get_online_users());
	}

	get_online_users()
	{
		return this.online_users.map(id =>
			{
		  		return {
					id: id,
		  		};
			});
	}

	@WebSocketServer()
	server;
	onModuleInit() {
		console.log("constructed this");
	}

	@SubscribeMessage('init_socket_online')
	async block_user(@MessageBody() data: any)
	{
		console.log("init_socket_online" + data);
		this.online_users.push(data);
		this.server.emit("online users update", this.get_online_users());
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

