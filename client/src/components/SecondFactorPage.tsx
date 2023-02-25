const SecondFactorPage = () => {

//   const handleLoginClick = async() => {
//     try {
//       const response = await fetch('http://localhost:3003/auth/login', {method: 'GET', credentials: "include"});
//       console.log(response);
//       // window.location.assign("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ebe5af0f2962dca5114adf05b60c69a7cbbb6ec31e4cd146812b74d954feb284&redirect_uri=http%3A%2F%2Flocalhost%3A3003%2Fauth%2Flogin&response_type=code");
//       // setLoggedIn(true);
      
//     }
//     catch (error) {
//       alert('An error occurred durinlg login');
//     }
//   }

  return (
    <div className="2nd-factor-page">
      <h1> Second Factor authentication </h1>
      <div>PLease enter the code here</div>
      <input type="text" />
      {/* <a href="#login" onClick={handleLoginClick}>Login</a> */}
    </div>
  );
};

export default SecondFactorPage;
