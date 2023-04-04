import { io } from 'socket.io-client'
import { createContext } from 'react';

export const our_socket = io(`http://${process.env.REACT_APP_Server_host_ip}:3003`);

export const SocketContext = createContext(our_socket);
