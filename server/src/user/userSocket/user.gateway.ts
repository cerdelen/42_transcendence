import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UserService } from '../user.service';


@WebSocketGateway((
	{
	  cors: {
		origin: '*',
	  },
	}
))
export class userGateway implements OnGatewayConnection
{
	handleConnection(client: any, ...args: any[]) {
	}
	constructor (private userService: UserService ) {}

		@WebSocketServer()
		server;
		onModuleInit() {
			//console.log("constructed ");
		}

		@SubscribeMessage('block_user')
		async block_user(@MessageBody() data: any)
		{
			await this.userService.block_user(data.user_id, data.user_to_block);
		}
		
		@SubscribeMessage('unblock_user')
		async unblock_user(@MessageBody() data: any)
		{
			await this.userService.unblock_user(data.user_id, data.user_to_unblock);
		}
} 
