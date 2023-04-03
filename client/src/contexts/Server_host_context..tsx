import { createContext } from 'react';

type Serv_context_type = {
	serv_ip: string,
};

export const Serv_context = createContext<Serv_context_type>({
	serv_ip: '',
});