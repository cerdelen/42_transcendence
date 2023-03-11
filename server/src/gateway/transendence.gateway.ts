import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";



@WebSocketGateway()
export class TranscendenceGateway
{
	constructor(){}

	@WebSocketServer()
    server;
}