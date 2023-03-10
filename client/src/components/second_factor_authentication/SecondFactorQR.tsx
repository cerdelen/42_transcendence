import { useState } from 'react'
import JSCookies from 'js-cookie'

type Props = {
    qrString: string;
}
const SecondFactorQR = ({qrString}: Props) => {
  
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState(false);
  //gets the string from the input
  const handleCodeChange = (event: any) => {
    const inputValue = event.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(inputValue);
  };

    //post request to the backend with the 6digit code and the userid
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (code.length === 6) {
      const myCookieValue = JSCookies.get('accessToken');
      fetch('http://localhost:3003/2-fa/turn-on', {
        method: 'POST',
        body: JSON.stringify({ "two_FA_code": code }),
        headers: {
                    // Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${myCookieValue}`,
        },
      })
        .then(response => {
          console.log(response);
          if (response.ok)
          {
            response.text().then(data => console.log(data));

            setSuccess(true);
            alert("2 Factor authentication has been Enabled.");
          }
        })
        .catch(error => {
          console.log(error);
          alert("Something went wrong");
        });
    }
  }
  
  return (
    <div>

    { !success &&  <div id='qr-form'>
          <img id="qr-code" src={qrString} alt=""/>
          <form onSubmit={handleSubmit}>
            <label>
              Enter 6-digit code:
              <input
                type="text"
                maxLength={6}
                pattern="[0-9]{6}"
                value={code}
                onChange={handleCodeChange}
                required
                />
            </label>
            <button type="submit">Submit</button>
        </form>
      
      </div>}
    </div>
  )
}

export default SecondFactorQR