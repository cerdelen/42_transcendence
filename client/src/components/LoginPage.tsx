import JSCookies from "js-cookie";

const LoginPage = () => {

  const handleLoginClick = async() => {
    try {
      window.location.assign("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ebe5af0f2962dca5114adf05b60c69a7cbbb6ec31e4cd146812b74d954feb284&redirect_uri=http%3A%2F%2Flocalhost%3A3003%2Fauth%2Flogin&response_type=code"); 
    }
    catch (error) {
      alert('An error occurred durinlg login');
    }
  }

  const fakeLogin = async() => {
    try {
        await fetch("http://localhost:3003/auth/create_test_user", {
        method: "Get",
      })
      JSCookies.set("accessToken", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdGluZ3VzZXIiLCJzdWIiOjMyMiwibWFpbCI6InRlc3Rpbmd1c2VyQGVtYWlsLmNvbSIsImlzX3R3b19GQWVkIjpmYWxzZSwiaWF0IjoxNjgwMjg3Mzk0LCJleHAiOjE2ODA4OTIxOTR9.ZYK3y01-j-Vck3OGx2J706JvC4PzaP48pkvVwv7AcY0');
      window.location.assign('http://localhost:3000/');
    }
    catch (error) {
      alert('An error occurred durinlg dummy login');
    }
  }

  return (
    <div className="login-page">
      <h1> CatPong </h1>
      <button className="deep-purple-button big-button" onClick={handleLoginClick}> <span>Login with 42</span> </button>
      <button className="deep-purple-button big-button" onClick={fakeLogin}> <span>Dummy login</span> </button>
    </div>
  );
};

export default LoginPage;