import { Server } from 'socket.io';

export class io_server {
	constructor(){
		const server = new Server();
 		 const sio = require('socket.io')(server, {
				cors: {
					origin: '*',
					}
				});
	}
}
// export const io_server = require("socket.io")(Server, {
// 	cors: {
// 	  origin: "https://example.com",
// 	  methods: ["GET", "POST"]
// 	}
//   });