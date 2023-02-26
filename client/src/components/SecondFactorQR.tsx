import { useState } from 'react'

type Props = {
    qrString: string;
}
const SecondFactorQR = ({qrString}: Props) => {
  
  const [code, setCode] = useState('');
  
    const handleCodeChange = (event: any) => {
      const inputValue = event.target.value.replace(/\D/g, '').slice(0, 6);
      setCode(inputValue);
    };
  
    const handleSubmit = (event: any) => {
      event.preventDefault();
      if (code.length === 6) {
        fetch('http://localhost:3003/2-fa/turn-on', {
          method: 'POST',
          body: JSON.stringify({ code }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            // Handle success or error response
          })
          .catch(error => {
            // Handle error
          });
      }
    }
  
  return (
    <div id='qr-form'>
      <img id="qr-code" src={`data:image/png;base64,${qrString}`} alt=""/>
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

    </div>
  )
}

export default SecondFactorQR