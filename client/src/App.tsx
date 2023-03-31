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
import { Socket } from "socket.io";
import { io } from "socket.io-client";
import { SocketContext, our_socket } from "./utils/context/SocketContext";
import Community from "./components/community/CommunityPage";
import LandingPage from "./LandingPage";
import 'reactjs-popup/dist/index.css';
import { emit } from "process";


import { useNavigate } from 'react-router-dom';
import PopUp from "./components/Popup";
import Ladder from "./components/ladder/Ladder";




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
  const [inviterName, setinviterName] = useState("");
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
      our_socket.emit("makeOnline", id);
    } catch (error) {
      console.error(error);
    }
  }
  

  // function acceptInvite()
  // {
  //   console.log("Invite accepted");
  //   setIsInvited(false);
  //   setinviterName("");
  //   // navigate("/home");
  //   let obj = {inviterName: inviterName, userId: userId}
  //   our_socket.emit("playerAccepted", JSON.stringify(obj))
  //   console.log("player accepted the invitation ");
  // }

  // function rejectInvite()
  // {
  //   if(isInvited === false)
  //     return ;
  //   console.log("Invite rejected");
  //   let obj = {inviterName: inviterName, userId: userId}
  //   our_socket.emit("rejectInvite", JSON.stringify(obj));
  //   setinviterName("");
  //   setIsInvited(false);
  // }
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
  // useEffect(() => 
  // {
  //     our_socket.on("invitationPopUp", (invitingUserName) =>
  //     {
  //       console.log("You've been invited mate");
  //       setinviterName(invitingUserName);
  //       setIsInvited(true);
  //     })
  // }, [])

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
          {/* <Popup open={isInvited} position="right center" onClose={rejectInvite} >
          <h2>You've been invited to the game by {inviterName}</h2>
          <center>
          <button className="game_buttons" onClick={acceptInvite}> Accept </button>
          <button className="game_buttons" onClick={rejectInvite}> Reject </button>
          </center>
          </Popup> */}
          {/* <PopUp/> */}
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
        </UserContext.Provider>
      </Displayed_Chat_Provider>
    </InfoCardProvider>
  );
}

export default App;
