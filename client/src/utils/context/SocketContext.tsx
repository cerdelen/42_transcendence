import { io } from 'socket.io-client'
import { createContext } from 'react';

export const our_socket = io('http://localhost:3003');

export const SocketContext = createContext(our_socket);