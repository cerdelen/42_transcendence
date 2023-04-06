import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Inject, forwardRef } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';

@WebSocketGateway((
	{
	  cors: {
		origin: '*',
	  },
	}
))
export class New_user_gateway
{
	constructor () {}

	@WebSocketServer()
	server;
	onModuleInit() {
		// console.log("constructed this new_user_gateway (only for update profile picture map)");
	}

	async emit_new_user(id: string)
	{
		//console.log("i am emitting new user");
		this.server.emit("new_user", id);
	}
}
