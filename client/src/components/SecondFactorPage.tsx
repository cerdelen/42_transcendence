import { useState } from "react";
import JSCookies from 'js-cookie'

const SecondFactorPage = () => {

const [code, setCode] = useState('');
  
const handleCodeChange = (event: any) => {
  const inputValue = event.target.value.replace(/\D/g, '').slice(0, 6);
  setCode(inputValue);
};

const handleSubmit = (event: any) => {
  event.preventDefault();
  console.log("hey");
  if (code.length === 6) {
    const myCookieValue = JSCookies.get('accessToken');
    console.log(`Here is my cookie = ${myCookieValue}`);
    // console.log(myCookieValue);
    // console.log(code);
    fetch('http://localhost:3003/2-fa/authenticate', {
      method: 'POST',
      body: JSON.stringify({ "two_FA_code": code }),
      headers: {
                  // Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${myCookieValue}`,
      },
      // credentials: 'include',
    })
      .then(response => {
        // Handle success or error response
        console.log(response);
      })
      .catch(error => {
        // Handle error
        console.log(error);
      });
  }
}

  return (
    <form id="second-factor-page" onSubmit={handleSubmit}>
    {/* <label>
      Enter 6-digit code:
      <input
        type="text"
        maxLength={6}
        pattern="[0-9]{6}"
        value={code}
        onChange={handleCodeChange}
        required
      />
    </label> */}
    <label htmlFor="code">Enter 6-digit code:</label>
  <input type="text" id="code" name="code" pattern="[0-9]{6}" onChange={handleCodeChange} required></input>
    <button type="submit">Submit</button>
</form>
  );
};

export default SecondFactorPage;
// form {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   min-height: 100vh;
// }
