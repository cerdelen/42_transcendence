import JSCookies from "js-cookie";
import { useContext } from "react";
import { Serv_context } from "../contexts/Server_host_context.";

const LoginPage = () => {

  const handleLoginClick = async() => {
    try {
       const serv_ip : string = process.env.REACT_APP_Server_host_ip ?? 'localhost';
       window.location.assign(`https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ebe5af0f2962dca5114adf05b60c69a7cbbb6ec31e4cd146812b74d954feb284&redirect_uri=http%3A%2F%2F${serv_ip}%3A3003%2Fauth%2Flogin&response_type=code`); 
    }
    catch (error) {
      alert('An error occurred durinlg login');
    }
  }

  const fakeLogin = async() => {
    try {
      // console.log('this is before fetch');
       const serv_ip : string = process.env.REACT_APP_Server_host_ip ?? 'localhost';
        await fetch(`http://${serv_ip}:3003/auth/create_test_user`, {
        method: "Get",
      })
      // console.log('this is after fetch');

      
      // const token = await response.text();
      // console.log('this is teh tokebn' + token);
      JSCookies.set("accessToken", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdGluZ3VzZXIiLCJzdWIiOjMyMiwibWFpbCI6InRlc3Rpbmd1c2VyQGVtYWlsLmNvbSIsImlzX3R3b19GQWVkIjpmYWxzZSwiaWF0IjoxNjgwMjg3Mzk0LCJleHAiOjE2ODA4OTIxOTR9.ZYK3y01-j-Vck3OGx2J706JvC4PzaP48pkvVwv7AcY0');
      // console.log('this is cookie' + JSCookies.get("accessToken"));
      window.location.assign(`http://${serv_ip}:3000/`);
    }
    catch (error) {
      alert('An error occurred durinlg dummy login');
    }
  }

  return (
    <div className="login-page">
      <h1> CatPong </h1>
      <button onClick={handleLoginClick}>Login with 42</button>
      <button onClick={fakeLogin}>Dummy login</button>
    </div>
  );
};

export default LoginPage;