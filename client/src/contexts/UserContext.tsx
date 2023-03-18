import React from 'react';
import { createContext } from 'react';
import io, { Socket} from 'socket.io-client';

export const UserContext = createContext({
    userId: '',
	name: '',
	mail: '',
	two_FA_enabled: false,
	two_FA_secret: '',
	friendlist: [],
	stats: {},
	games: [],				// ids of games??
	show_default_image: false,
	// socket: io('localhost:3003')
});

