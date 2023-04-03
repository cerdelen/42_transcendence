import { io } from 'socket.io-client'
import { createContext, useContext } from 'react';
import { Serv_context } from '../../contexts/Server_host_context.';

export const our_socket = io(`http://${process.env.REACT_APP_Server_host_ip}:3003`);

export const SocketContext = createContext(our_socket);