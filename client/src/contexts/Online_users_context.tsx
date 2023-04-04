import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { our_socket } from "../utils/context/SocketContext";
import { UserContext } from "./UserContext";
// import { online_users_class } from "../utils/types"

type MyContextType = {
	online_users: number[];
	setonline_users: React.Dispatch<React.SetStateAction<number[]>>;
};

const online_users_Context = createContext<MyContextType>({
	online_users: [],
	setonline_users: () => {},
});

export const useMyDisplayedChatContext = () => useContext(online_users_Context);

type MyContextProviderProps = {
  children: React.ReactNode;
};

export function Online_users_Provider({ children }: MyContextProviderProps)
{
	const { userId } = useContext(UserContext)
	const [online_users, setonline_users] = useState<number[]>([]);
	
	useEffect(() =>{
		our_socket.emit("init_socket_online", userId);
	}, []);


	our_socket.on("online users update", (new_online_users : number[]) =>{
		console.log("trying to update online users ... this should be online users now " +JSON.stringify(new_online_users)) ;
		
		setonline_users(new_online_users);
		console.log("this is online users now " +JSON.stringify(online_users)) ;
	});



  	const value = {
		online_users,
		setonline_users,
  	};

  return (
    <online_users_Context.Provider value={value}>
      {children}
    </online_users_Context.Provider>
  );
}

export default Online_users_Provider;
