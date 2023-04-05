import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { our_socket } from '../utils/context/SocketContext';

interface online_users_context_type {
    online_users: number[];
}

export const Online_users_context = createContext<online_users_context_type>({
	online_users: [],
});
interface Props {
    children: any;
}
export const Online_users_Provider: React.FC<Props> = ({children}) => {
	const [online_users, setonline_users] = useState<number[]>([])

	useEffect(() => 
	{
		our_socket.on("online users update", (new_online_users : number[]) =>{
			setonline_users(new_online_users);
			our_socket.off("online users update");
		})
	}, [online_users])

		const value = {
					online_users,
				};


  return (
    <Online_users_context.Provider value={value}>
      {children}
    </Online_users_context.Provider>
  );
};

export default Online_users_Provider;