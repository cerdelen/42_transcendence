import "./App.css";
import React, { useEffect, useState } from "react";
import JSCookies from 'js-cookie'
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
// import { MyProvider } from "./components/AppContext";
import SecondFactorPage from "./components/second_factor_authentication/SecondFactorPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContext, ConversationContextType } from './utils/context/AuthContext';
import { User } from './utils/types';
import {PropsWithChildren} from 'react';
// import { ValidationPipe } from '@nestjs/common';
import { SocketContext, socket } from './utils/context/SocketContext';




export const ConversationContext = React.createContext<ConversationContextType[]>([]);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();
  const [conversations, setConversations] = useState([]);

  type Props = {
    user?: User;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  }
  
  function AppWithProviders({
    children,
    user,
    setUser,
  }: PropsWithChildren & Props) {
    return <AuthContext.Provider value={{user, updateAuthUser: setUser}}>
      {children}
    </AuthContext.Provider>
  }

  useEffect(() => {
    const myCookie = JSCookies.get('accessToken');
    if (myCookie !== undefined) {
      console.log('Set logged in to true');
      setLoggedIn(true);
    }
  
  }, []);

  return (
    // <MyProvider loggedIn={loggedIn} setLoggedIn={setLoggedIn}>
    <ConversationContext.Provider value={conversations}>
    <AppWithProviders user={user} setUser={setUser}>
    <SocketContext.Provider value = {socket }>
      <BrowserRouter>

        <Routes>

          <Route path="/" element={loggedIn ? <HomePage/> : <LoginPage/>}/>

          <Route path="/auth" element={<SecondFactorPage/>}/>
          <Route path="/home/:id" element={<HomePage/>}/>
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
    </AppWithProviders>
    </ConversationContext.Provider>
    // {/* // </MyProvider> */}
  );
}

export default App