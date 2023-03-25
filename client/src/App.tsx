import "./App.css";
import React, { useEffect, useState } from "react";
import JSCookies from "js-cookie";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import SecondFactorPage from "./components/second_factor_authentication/SecondFactorPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  AuthContext,
  ConversationContextType,
} from "./utils/context/AuthContext";
import Game from "./components/Game";
import { UserContext } from "./contexts/UserContext";
import InfoCardProvider from "./contexts/InfoCardContext";
import Displayed_Chat_Provider from "./contexts/Displayed_Chat_Context"
import { Socket } from "socket.io";
import { io } from "socket.io-client";
import { SocketContext, our_socket } from './utils/context/SocketContext';

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
  const [show_default_image, setHasPicture] = useState(false);

  async function getUser() {
    try {
      let response = await fetch("http://localhost:3003/user/get_id", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      });
      const id = await response.text();
      
      setUserId(id);
      await getData(id);
      our_socket.emit('makeOnline', id);
    } catch (error) {
      console.error(error);
    }
  }

  async function getData(userid: string) {
    try {
      let response = await fetch("http://localhost:3003/user/user_data", {
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
      setHasPicture(data["show_default_image"]);
      
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => 
    {
        our_socket.on("online_check", () => 
        {
          our_socket.emit("online_inform", {userId});
        })
    }, [])
  useEffect(() => {
    const myCookie = JSCookies.get("accessToken");
    if (myCookie !== undefined) {
      setLoggedIn(true);
      getUser();
    }

  }, []);
  useEffect(() => {
    function handleBeforeUnload(e: any) {
      // Send socket event here
      e.preventdefault();
      our_socket.emit('makeOffline', {userId});
      alert("Siemanko");
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  return (
    <InfoCardProvider>
      <Displayed_Chat_Provider>

          <UserContext.Provider
            value={{
              userId: userId,
              friendlist: friendlist,
              games: games,
              show_default_image: show_default_image,
              mail: mail,
              name: name,
              stats: stats,
              two_FA_enabled: two_FA_enabled,
              two_FA_secret: two_FA_secret,
            }}
            >
            <BrowserRouter>
              <Routes>
                <Route path="/" element={loggedIn ? <HomePage userId={userId}/> : <LoginPage />} />
                <Route path="/game" element={<Game userId={userId} />} />
                <Route path="/auth" element={<SecondFactorPage />} />
                <Route path="/home" element={<HomePage userId={userId}/>} />
              </Routes>
            </BrowserRouter>
          </UserContext.Provider>

      </Displayed_Chat_Provider>
    </InfoCardProvider>

  );
}

export default App;

