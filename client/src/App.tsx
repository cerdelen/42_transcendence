import { useState } from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

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
