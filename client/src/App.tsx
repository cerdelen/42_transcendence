import "./App.css";
import React, { useEffect, useState } from "react";
import JSCookies from "js-cookie";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import { CounterProvider } from "./utils/context/CounterContext"
import SecondFactorPage from "./components/second_factor_authentication/SecondFactorPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./components/Game";
import { useUserContext } from "./contexts/UserContext";
import InfoCardProvider from "./contexts/InfoCardContext";
import Displayed_Chat_Provider from "./contexts/Displayed_Chat_Context";
import Online_users_Provider from "./contexts/Online_users_context";
import { our_socket } from "./utils/context/SocketContext";
import Community from "./components/community/CommunityPage";
import LandingPage from "./LandingPage";
import 'reactjs-popup/dist/index.css';
import Ladder from "./components/ladder/Ladder";
import Profile_picture_Provider from "./contexts/Profile_picture_context";


function App() {

  const [isInvited, setIsInvited] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { myUserId } = useUserContext();
  const [inviterName, setinviterName] = useState("");

  useEffect(() => {
    if (myUserId !== '') {
      console.log("this is user id " + myUserId);
      our_socket.emit("online_inform", myUserId);
      console.log("User online")
    }
  }, [myUserId]);

  useEffect(() => {
    const myCookie = JSCookies.get("accessToken");
    if (myCookie !== undefined) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (myUserId) {
      console.log("User id setted up ", myUserId)
      our_socket.emit("setupUserSocketId", myUserId);
    }
  }, [myUserId])

  useEffect(() => {
    our_socket.on("invitedUserIsOffline", () => {
      alert("Invited user is offline try again later");
    })
  }, []);

  // let reset : boolean = false;
  useEffect(() => {
    // reset =true;
    our_socket.on("user_ingame_or_queue", () => {
      // our_socket.off("user_ingame_or_queue");
      alert("Invited user is either ingame or in the queue!");
      // reset = false;
    })
  }, []);
  

  useEffect(() => {
    our_socket.on("invitationPopUp", (invitingUserName) => {
      console.log("You've been invited mate");
      setinviterName(invitingUserName);
      setIsInvited(true);
    })
  }, [])
  return (

    <InfoCardProvider>
      <Displayed_Chat_Provider>
        <CounterProvider>
          <Online_users_Provider>
            <Profile_picture_Provider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={loggedIn ? <HomePage setInviterName={setinviterName} inviterName={inviterName} isInvited={isInvited} setIsInvited={setIsInvited} /> : <LoginPage />} >
                    <Route index element={<LandingPage />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/ladder" element={<Ladder />} />
                  </Route>
                  <Route path="/auth" element={<SecondFactorPage />} />
                </Routes>
              </BrowserRouter>
            </Profile_picture_Provider>
          </Online_users_Provider>
        </CounterProvider>
      </Displayed_Chat_Provider>
    </InfoCardProvider>
  )
}
export default App;