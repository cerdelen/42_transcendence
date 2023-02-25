// import { useState } from "react";


type Props = {
	loggedIn: boolean;
	setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage = ({loggedIn, setLoggedIn}: Props) => {

  const handleLoginClick = async() => {
    try {
      // const response = await fetch('/auth/login', {method: 'GET', credentials: "include"});
      // console.log(response);
      window.location.assign("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ebe5af0f2962dca5114adf05b60c69a7cbbb6ec31e4cd146812b74d954feb284&redirect_uri=http%3A%2F%2Flocalhost%3A3003%2Fauth%2Flogin&response_type=code");
      // setLoggedIn(true);
      
    }
    catch (error) {
      alert('An error occurred durinlg login');
    }
  }

  return (
    <div className="login-page">
      <h1> CatPong </h1>
      <a href="#login" onClick={handleLoginClick}>Login</a>
    </div>
  );
};

export default LoginPage;
