import { useState } from "react";
import JSCookies from "js-cookie";

const SecondFactorPage = () => {
  //gets the user id from the url
  const userId = new URLSearchParams(window.location.search).get("2fa");
  
  //gets the string from the input
  const [code, setCode] = useState("");
  const handleCodeChange = (event: any) => {
    const inputValue = event.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(inputValue);
  };

  //post request to the backend with the 6digit code and the userid
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (code.length === 6) {

      const myCookieValue = JSCookies.get("accessToken");
      fetch("http://localhost:3003/2-fa/authenticate", {
        method: "POST",
        body: JSON.stringify({ two_FA_code: code, userId: userId }),
        headers: {
          // Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${myCookieValue}`,
        },
      })
        .then((response) => {
          if (response.ok) 
          {
            // console.log(response);
            // window.location.assign("http://localhost:3000/home");
            // response.text().then(data => console.log(data));
            // console.log();
            // console.log("hello");
            console.log(JSCookies.get("accessToken"));
          }
        })
        .catch((error) => {
          console.log(`Logging the error: ${error}`);
        });
    }
  };

  return (
    <form id="second-factor-page" onSubmit={handleSubmit}>
      <label htmlFor="code">Enter 6-digit code:</label>
      <input
        type="text"
        id="code"
        name="code"
        pattern="[0-9]{6}"
        onChange={handleCodeChange}
        required
      ></input>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SecondFactorPage;
