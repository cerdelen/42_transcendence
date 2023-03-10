import "./App.css";
import { useEffect, useState } from "react";
import JSCookies from 'js-cookie'
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
// import { MyProvider } from "./components/AppContext";
import SecondFactorPage from "./components/second_factor_authentication/SecondFactorPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Pong from "./components/Pong";
import io, { Socket} from 'socket.io-client';
import Game from "./components/Game";
import UserPage from "./components/UserPage";
import { UserContext } from "./contexts/UserContext";


const socket = io('localhost:3003');

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState({});
  
  async function getUser() {
    try {

      let response = await fetch("http://localhost:3003/user/get_id", {
        method: "Post",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      }
      )
      setUserId(await response.text());
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    const myCookie = JSCookies.get('accessToken');
    if (myCookie !== undefined) {
      console.log('Set logged in to true');
      setLoggedIn(true);
      getUser();
    }
  
  }, []);

  return (
    // <MyProvider loggedIn={loggedIn} setLoggedIn={setLoggedIn}>
    <UserContext.Provider value={{userId: userId}}>
      <BrowserRouter>

        <Routes>

          <Route path="/" element={loggedIn ? <HomePage socket={socket}/> : <LoginPage/>}/>
          {/* <Route path="/loggedin" element={loggedIn ? <HomePage socket={socket}/> : <LoginPage/>}/> */}
          <Route path="/game" element={ <Game socket={socket} />}/>
          <Route path="/auth" element={<SecondFactorPage/>}/>
          <Route path="/home" element={<HomePage socket={socket} />}  />
          <Route path="/user" element={<UserPage/>}/>
        </Routes>

      </BrowserRouter>
    </ UserContext.Provider>
        
      
    // </MyProvider>
    
  );
}

export default App