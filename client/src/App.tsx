import { useEffect, useState } from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);


  useEffect(() => {
    const myCookieValue = document.cookie
      .split('; ')
      .find(cookie => cookie.startsWith('accessToken='))
      ?.split('=')[1];
    if (myCookieValue !== undefined) {
      setLoggedIn(true);
    }
  }, []);
  
  return (
    <>
      {loggedIn ? 
        <HomePage />
      : 
        <LoginPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      }
      {/* {communityPage ? <> } */}
    </>
  );
}

export default App;
