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

const socket = io('localhost:3003');

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    const myCookie = JSCookies.get('accessToken');
    if (myCookie !== undefined) {
      console.log('Set logged in to true');
      setLoggedIn(true);
    }
  
  }, []);

  return (
    // <MyProvider loggedIn={loggedIn} setLoggedIn={setLoggedIn}>

    <BrowserRouter>

      <Routes>

        <Route path="/" element={loggedIn ? <HomePage socket={socket}/> : <LoginPage/>}/>
        <Route path="/game" element={ <Game socket={socket} />}/>
        <Route path="/auth" element={<SecondFactorPage/>}/>
        <Route path="/home" element={<HomePage socket={socket} />}  />
      </Routes>

    </BrowserRouter>
        
      
    // </MyProvider>
    
  );
}

export default App