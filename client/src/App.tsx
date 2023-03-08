import "./App.css";
import { useEffect, useState } from "react";
import JSCookies from 'js-cookie'
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
// import { MyProvider } from "./components/AppContext";
import SecondFactorPage from "./components/second_factor_authentication/SecondFactorPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Pong from "./components/Pong";

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
        <Route path="/" element={loggedIn ? <HomePage/> : <LoginPage/>}/>
        <Route path="/auth" element={<SecondFactorPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
      
      
    // </MyProvider>
  );
}

export default App