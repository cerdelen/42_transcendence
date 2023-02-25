import { useEffect, useState } from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import { MyProvider } from "./components/AppContext";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);


  // useEffect(() => {
  //   const myCookieValue = document.cookie
  //     .split('; ')
  //     .find(cookie => cookie.startsWith('accessToken='))
  //     ?.split('=')[1];
  //   if (myCookieValue !== undefined) {
  //     setLoggedIn(true);
  //   }
  //   console.log(myCookieValue);
  // }, []);
  return (
    <MyProvider>
      <HomePage />

      {/* {loggedIn ? 
        <HomePage />
      : 
        <LoginPage />
      } */}
      
      {/* {communityPage ? <> } */}
    </MyProvider>
  );
}

export default App;
