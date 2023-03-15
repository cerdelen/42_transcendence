import React from 'react';
import { createContext } from 'react';

export const UserContext = createContext({
    userId: '',
	name: '',
	mail: '',
	two_FA_enabled: false,
	two_FA_secret: '',
	friendlist: [],
	stats: {},
	games: [],				// ids of games??
	has_picture: false,
});

