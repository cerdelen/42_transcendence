import "./App.css";
import React, { useEffect, useState } from "react";
import JSCookies from "js-cookie";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import SecondFactorPage from "./components/second_factor_authentication/SecondFactorPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  AuthContext,
  ConversationContextType,
} from "./utils/context/AuthContext";
import Game from "./components/Game";
import { UserContext } from "./contexts/UserContext";
import InfoCardProvider, { useMyContext } from "./contexts/InfoCardContext";
import Displayed_Chat_Provider from "./contexts/Displayed_Chat_Context";
import { SocketContext, our_socket } from "./utils/context/SocketContext";
import Community from "./components/community/CommunityPage";
import LandingPage from "./LandingPage";
import 'reactjs-popup/dist/index.css';
import Ladder from "./components/ladder/Ladder";
import Profile_picture_Provider from "./contexts/Profile_picture_context";
import { Serv_context } from "./contexts/Server_host_context.";




export const ConversationContext = React.createContext<
  ConversationContextType[]
>([]);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [two_FA_enabled, set2FA] = useState(false);
  const [two_FA_secret, set2FASecret] = useState("");
  const [friendlist, setFriendslist] = useState([]);
  const [stats, setStats] = useState({});
  const [games, setGames] = useState([]);
  const [inviterName, setinviterName] = useState("");
	const [photo, setPhoto] = useState("");
  const [blcoked_users, set_blcoked_users] = useState([]);
  const serv_ip : string = process.env.REACT_APP_Server_host_ip ?? 'localhost';
  async function getUser()
  {
    try {
      let response = await fetch(`http://${serv_ip}:3003/user/get_id`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      });
      const id = await response.text();

      setUserId(id);
      await getData(id);
      our_socket.emit("makeOnline", id);
    } catch (error) {
      console.error(error);
    }
  }

  async function getData(userid: string) {
    try {
      let response = await fetch(`http://${serv_ip}/user/user_data`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: JSON.stringify({ user_id: userid }),
      });
      const data = await response.json();
      set2FA(data["two_FA_enabled"]);
      set2FASecret(data["two_FA_secret"]);
      setName(data["name"]);
      setMail(data["mail"]);
      setFriendslist(data["friendlist"]);
      setStats(data["stats"]);
      setGames(data["games"]);
      set_blcoked_users(data["blocked_users"]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    our_socket.on("online_check", () => {
      our_socket.emit("online_inform", { userId });
    });
  },[] );
  
  useEffect(() => {
    const myCookie = JSCookies.get("accessToken");
    if (myCookie !== undefined) {
      setLoggedIn(true);
      getUser();
    }
  }, []);

  useEffect( () => 
  {
    our_socket
  })
  useEffect(() =>
  {
    console.log("User id on the frontend " , userId)
    our_socket.emit("setupUserSocketId", userId);
  }, [userId])
 


  console.log(process.env.REACT_APP_Server_host_ip);
  

  return (
    <InfoCardProvider>
      <Displayed_Chat_Provider>
        <UserContext.Provider
          value={{
            userId: userId,
            friendlist: friendlist,
            games: games,
            mail: mail,
            name: name,
            stats: stats,
            two_FA_enabled: two_FA_enabled,
            two_FA_secret: two_FA_secret,
            blocked_users: blcoked_users,
          }}
        >
          <Serv_context.Provider 
            value={{
              serv_ip: serv_ip,
            }}
            >
            <Profile_picture_Provider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={loggedIn ? <HomePage /> : <LoginPage />} >
                    <Route index element={<LandingPage/>} />
                    <Route path="/game" element={<Game userId={userId} />} />
                    <Route path="/community" element={<Community userId={userId} />} />
                    <Route path="/ladder" element={<Ladder />} />
                  </Route>
                  <Route path="/auth" element={<SecondFactorPage />} />
                </Routes>
              </BrowserRouter>
            </Profile_picture_Provider>
          </Serv_context.Provider>
        </UserContext.Provider>
      </Displayed_Chat_Provider>
    </InfoCardProvider>
  );
}

export default App;
