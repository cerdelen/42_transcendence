import { useContext, useState } from "react";
import JSCookies from "js-cookie";
import { Serv_context } from "../../contexts/Server_host_context.";

const SecondFactorPage = () => {
  //gets the user id from the url
  const userId = new URLSearchParams(window.location.search).get("2fa");
	 const serv_ip : string = process.env.REACT_APP_Server_host_ip ?? 'localhost';
  
  //gets the string from the input
  const [code, setCode] = useState("");
  const handleCodeChange = (event: any) => {
    const inputValue = event.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(inputValue);
  };

  //post request to the backend with the 6digit code and the userid
 const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (code.length === 6) {

      const myCookieValue = JSCookies.get("accessToken");
      try {

        const response = await fetch(`http://${serv_ip}:3003/2-fa/authenticate`, {
          method: "POST",
          body: JSON.stringify({ two_FA_code: code, userId: userId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${myCookieValue}`,
          },
        });
        
        if (response.ok) {
          window.location.assign(`http://${serv_ip}:3000/`);
          const token = await response.text();
          JSCookies.set("accessToken", token);
        }
      } catch (error) {
        console.error(`Logging the error: ${error}`);

      }
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
      <button className="purple-button" type="submit">Submit</button>
    </form>
  );
};

export default SecondFactorPage;
