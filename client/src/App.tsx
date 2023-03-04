import { useEffect, useState } from "react";
import "./App.css";
import "./styles/chat.css"
import "./styles/open-chat-card.css"
import "./styles/toggle-button.css"
import "./styles/qr-form.css"
import JSCookies from 'js-cookie'
import "./styles/second-factor-page.css"
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import { MyProvider } from "./components/AppContext";
import SecondFactorPage from "./components/SecondFactorPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isTwoFactor, setTwoFactor] = useState(false);
  const [userId, setUserId] = useState("");
  
  
  useEffect(() => {
    const myCookie = JSCookies.get('accessToken');
    if (myCookie !== undefined || myCookie === '') {
      setLoggedIn(true);
    }
    const urlParams = new URLSearchParams(window.location.search);
    setTwoFactor(urlParams.has('2-fa'));
    if (isTwoFactor){
      console.log("front userid");
      setUserId(urlParams.get('2-fa') as string);
    }

    // console.log(myCookie);
  }, []);

  return (
    <MyProvider loggedIn={loggedIn} setLoggedIn={setLoggedIn}>
      {isTwoFactor && !loggedIn && <HomePage/>}
      {isTwoFactor &&  <SecondFactorPage userID={userId} isTwoFactor={isTwoFactor} setTwoFactor={setTwoFactor}/>}
      {loggedIn && <HomePage />}
      {!loggedIn && <LoginPage /> }
      
    </MyProvider>
  );
}

export default App;
