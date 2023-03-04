import { useEffect, useState } from "react";
import "./App.css";
import "./styles/chat.css"
import "./styles/open-chat-card.css"
import "./styles/toggle-button.css"
import "./styles/qr-form.css"
import "./styles/second-factor-page.css"
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import { MyProvider } from "./components/AppContext";
import SecondFactorPage from "./components/SecondFactorPage";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);


  useEffect(() => {
    const myCookieValue = document.cookie
      .split('; ')
      .find(cookie => cookie.startsWith('accessToken='))
      ?.split('=')[1];
    if (myCookieValue !== undefined || myCookieValue === '') {
      setLoggedIn(true);
    }
    console.log(myCookieValue);
  }, []);
  return (
    <MyProvider loggedIn={loggedIn} setLoggedIn={setLoggedIn}>
      {/* <SecondFactorPage/> */}
      {loggedIn && <HomePage />}
      
      {!loggedIn && <LoginPage /> }
      
      {/* {communityPage ? <> } */}
    </MyProvider>
  );
}

export default App;
