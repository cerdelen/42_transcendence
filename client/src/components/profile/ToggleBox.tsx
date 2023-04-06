import { useEffect, useState } from "react";
import JSCookies from "js-cookie";
export{}
const ipAddress = process.env.REACT_APP_Server_host_ip;

interface Props {
  setBase64String: React.Dispatch<React.SetStateAction<string>>;
  status2FA: boolean;
}
const ToggleBox: React.FC<Props> = ({ setBase64String, status2FA }) => {
  const [checked, setChecked] = useState<boolean>(false);
  useEffect(() => {
    setChecked(status2FA);
  }, [status2FA]);

  async function handleCheckboxChange() {
    setChecked((prevChecked) => !prevChecked);

    //if the user went from unchecked to checked
    if (!checked) {
      // console.log(`In here again.. ${checked}`);
      const myCookieValue = JSCookies.get("accessToken");
      //request a Base64String to create a QR code
      const response = await fetch(`http://${ipAddress}:3003/2-fa/generate`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${myCookieValue}`,
        },
      });

      //get the data as a string and set it
      const dataBlob = await response.blob();
      const text = await dataBlob.text();
      setBase64String(text);
    } //from checked to uncheked
    else {
      setBase64String("");
      //disable 2f at backend
      const myCookieValue = JSCookies.get("accessToken");
      const response = await fetch(`http://${ipAddress}:3003/2-fa/turn-off`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${myCookieValue}`,
        },
      });
      const token = await response.text();
      JSCookies.set("accessToken", token);
    }
  }

  return (
    <label className="switch">
      <div className="label-text">2FA</div>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <span id="slider-button" className="slider round"></span>
    </label>
  );
};

export default ToggleBox;