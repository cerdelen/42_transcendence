import JSCookies from "js-cookie";

import ipAddress from '../constants';


const LoginPage = () => {
  console.log(ipAddress);
  
  const handleLoginClick = async() => {
    try {
      window.location.assign(`https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ebe5af0f2962dca5114adf05b60c69a7cbbb6ec31e4cd146812b74d954feb284&redirect_uri=http%3A%2F%2F${ipAddress}%3A3003%2Fauth%2Flogin&response_type=code`); 
    }
    catch (error) {
      alert('An error occurred durinlg login');
    }
  }

  const fakeLogin = async() => {
    try {
        await fetch(`http://${ipAddress}:3003/auth/create_test_user`, {
        method: "Get",
      })
      JSCookies.set("accessToken", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdGluZ3VzZXIiLCJzdWIiOjMyMiwibWFpbCI6InRlc3Rpbmd1c2VyQGVtYWlsLmNvbSIsImlzX3R3b19GQWVkIjpmYWxzZSwiaWF0IjoxNjgwOTcwMzIwfQ.UJJlJs3pPREgRgwUC7LiFjxSN2Wfb5XiKwccsG9FYmg');

      window.location.assign(`http://${ipAddress}:3000/`);
    }
    catch (error) {
      alert('An error occurred durinlg dummy login');
    }
  }

  return (
    <div className="login-page">
      <h1> CatPong </h1>
      <button className="deep-purple-button big-button" onClick={handleLoginClick}> <span>Login with 42</span> </button>
      {/* <button className="deep-purple-button big-button" onClick={fakeLogin}> <span>Dummy login</span> </button> */}
    </div>
  );
};

export default LoginPage;