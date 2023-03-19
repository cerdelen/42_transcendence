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
import { User } from "./utils/types";
import { PropsWithChildren } from "react";
// import { ValidationPipe } from '@nestjs/common';
import { SocketContext, our_socket } from "./utils/context/SocketContext";
import Pong from "./components/Pong";
// import io, { Socket} from 'socket.io-client';
import Game from "./components/Game";
import UserPage from "./components/user/UserPage";
import { UserContext } from "./contexts/UserContext";
import InfoCardProvider from "./contexts/InfoCardContext";

// const socket = io('localhost:3003');
export const ConversationContext = React.createContext<
  ConversationContextType[]
>([]);

// function App() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [userId, setUserId] = useState('');
//   console.log( "User id" + userId);
//   const [userData, setUserData] = useState({});
//   const [conversations, setConversations] = useState([]);

// type Props = {
//   user?: User;
//   setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
// }

// function AppWithProviders({
//   children,
//   user,
//   setUser,
// }: PropsWithChildren & Props) {
//   return <AuthContext.Provider value={{user, updateAuthUser: setUser}}>
//     {children}
//   </AuthContext.Provider>
// }

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
      await setUserId(id);
      await getData(id);
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
      await set2FA(data["two_FA_enabled"]);
      await set2FASecret(data["two_FA_secret"]);
      await setName(data["name"]);
      await setMail(data["mail"]);
      await setFriendslist(data["friendlist"]);
      await setStats(data["stats"]);
      await setGames(data["games"]);
      await setHasPicture(data["show_default_image"]);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    const myCookie = JSCookies.get("accessToken");
    if (myCookie !== undefined) {
      console.log("Set logged in to true");
      setLoggedIn(true);
      getUser();
    }
  }, []);

  return (
    // <MyProvider loggedIn={loggedIn} setLoggedIn={setLoggedIn}>
    <InfoCardProvider>
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
          // socket: socket,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={loggedIn ? <HomePage userId={userId}/> : <LoginPage />} />
            {/* <Route path="/loggedin" element={loggedIn ? <HomePage socket={socket}/> : <LoginPage/>}/> */}
            <Route path="/game" element={<Game userId={userId} />} />
            <Route path="/auth" element={<SecondFactorPage />} />
            <Route path="/home" element={<HomePage userId={userId}/>} />
            {/* <Route path="/user" element={<UserPage />} /> */}
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </InfoCardProvider>

    // </MyProvider>
  );
}

export default App;
