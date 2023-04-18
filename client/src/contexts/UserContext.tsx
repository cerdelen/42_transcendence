import { createContext, useContext, useEffect, useState } from 'react';
import JSCookies from "js-cookie";
import { our_socket } from '../utils/context/SocketContext';
import ipAddress from '../constants';

type UserContextType = {
	myUserId: string,
	myName: string,
	myMail: string,
	mytwoFAenabled: boolean,
	gameActive: boolean,
	gameStarted: boolean,
	gameInvited:  boolean,
	setGameInvited: React.Dispatch<React.SetStateAction<boolean>>,
	setGameStarted: React.Dispatch<React.SetStateAction<boolean>>, 
	setGameActive:  React.Dispatch<React.SetStateAction<boolean>>,
	myFriendList: number[],
	setMyFriendList: React.Dispatch<React.SetStateAction<Array<number>>>,
	myStats: any,
	myGames: number[],
	myBlockedUsers: number[],
	myIncomingFriendReq: number [],
	myOutgoingFriendReq: number [],
	setMyIncomingFriendReq: React.Dispatch<React.SetStateAction<Array<number>>>,
	setMyOutgoingFriendReq: React.Dispatch<React.SetStateAction<Array<number>>>,
};

export const UserContext = createContext<UserContextType>({
	myUserId: '',
	myName: '',
	myMail: '',
	mytwoFAenabled: false,
	gameStarted: false,
	setGameStarted: () => {},
	gameActive: false,	
	setGameActive:  () => {},
	gameInvited:  false,
	setGameInvited: () => {},
	myFriendList: [],
	setMyFriendList: () => {},
	myStats: {},
	myGames: [],
	myBlockedUsers: [],
	myOutgoingFriendReq: [],
	myIncomingFriendReq: [],
	setMyIncomingFriendReq: () => {},
	setMyOutgoingFriendReq: () => {},
});

export const useUserContext = () => useContext(UserContext);


type UserContextProviderProps = {
  children: React.ReactNode;
};

export function UserContextProvider({children}: UserContextProviderProps) {
	const [myUserId, setUserId] = useState("");
	const [myName, setName] = useState("");
	const [myMail, setMail] = useState("");
	const [mytwoFAenabled, set2FA] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [gameInvited, setGameInvited] = useState(false);
	const [myFriendList, setMyFriendList] = useState<number[]>([]);
	const [myStats, setStats] = useState({});
	const [myGames, setGames] = useState<number[]>([]);
	const [myBlockedUsers, set_my_blcoked_users] = useState<number[]>([]);
	const [myIncomingFriendReq, setMyIncomingFriendReq] = useState<Array<number>>([]);
	const [gameActive, setGameActive] = useState(false);
	const [myOutgoingFriendReq, setMyOutgoingFriendReq] = useState<Array<number>>([]);
useEffect(() => {
	async function getUser() {
		try {
		  let response = await fetch(`http://${ipAddress}:3003/user/get_id`, {
			method: "Post",
			headers: {
			  "Content-Type": "application/json",
			  Authorization: `Bearer ${JSCookies.get("accessToken")}`,
			},
		  });
		  const id = await response.text();
	
		  
		  await getData(id);
		  setUserId(id);
	
		  our_socket.emit("makeOnline", id);
		} catch (error) {
		  console.error(error);
		}
	  }
	  
	async function getData(userid: string) {
		try {
		  let response = await fetch(`http://${ipAddress}:3003/user/user_data`, {
			method: "Post",
			headers: {
			  "Content-Type": "application/json",
			  Authorization: `Bearer ${JSCookies.get("accessToken")}`,
			},
			body: JSON.stringify({ user_id: userid }),
		  });
		  const data = await response.json();
		  set2FA(data["two_FA_enabled"]);
		  setName(data["name"]);
		  setMail(data["mail"]);
		  setMyFriendList(data["friendlist"]);
		  
		  setStats(data["stats"]);
		  setGames(data["games"]);
		  set_my_blcoked_users(data["blocked_users"]);
		  setMyIncomingFriendReq(data["incoming_friend_req"])
		  setMyOutgoingFriendReq(data["outgoing_friend_req"])
		} catch (error) {
		  console.error(error);
		}
	  }
	  const myCookie = JSCookies.get("accessToken");
    	if (myCookie !== undefined) {
      		getUser();
    	}
	}, [])
	
	// console.log("myfriendlist " + myFriendList);
const value={
	myUserId,
	myName,
	myMail,
	mytwoFAenabled,
	gameStarted,
	setGameStarted,
	gameActive, 
	setGameActive,
	gameInvited,
	setGameInvited,
	myFriendList,
	setMyFriendList,
	myGames,
	myStats,
	myBlockedUsers,
	myOutgoingFriendReq,
	myIncomingFriendReq,
	setMyIncomingFriendReq,
	setMyOutgoingFriendReq,
  }
	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	)
}
