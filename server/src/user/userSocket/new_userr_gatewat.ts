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
		console.log("emittttting new usuususuerr");
		
		this.server.emit("new_user", id);
	}
}
