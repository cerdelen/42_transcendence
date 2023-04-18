import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway((
	{
	  cors: {
		origin: '*',
	  },
	}
))
export class New_user_gateway implements OnGatewayConnection
{
	constructor () {}

	@WebSocketServer()
	server;
	onModuleInit() {
	}

	handleConnection(client: any)
	{
		client.setMaxListeners(20);
	}

	async emit_new_user(id: string)
	{
		// console.log("emittttting new usuususuerr");
		
		this.server.emit("new_user", id);
	}
	
	async new_friend_accepted(friend_id_1: number, friend_id_2: number)
	{
		this.server.emit("new_friend_accepted", { friend_id_1: friend_id_1, friend_id_2: friend_id_2 });
	}

	async new_friend_request_received(received_friend_req: number, sent_friend_req: number)
	{
		this.server.emit("new_friend_request_received", {received_friend_req: received_friend_req, sent_friend_req: sent_friend_req});
	}

	async delete_friend_request(user_one: number, user_two: number)
	{
		this.server.emit("delete_friend_request", {user_one: user_one, user_two: user_two});
	}

	async remove_friend(user_one: number, user_two: number)
	{
		this.server.emit("remove_friend", {user_one: user_one, user_two: user_two});
	}
}
