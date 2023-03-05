import { useMyContext } from "./AppContext";
import { useRef, useState } from "react";
import { players, Player } from "../models/temp-players";
import profile from "../images/cat-grass.jpg";
import themeAchievement from "../images/changed-theme-achievement.png";
import threeWinsAchievement from "../images/three-wins-achievement.png";
import halfGamesAchievement from "../images/won-half-of-your-games-achievement.png";
import expertLevel from "../images/expert-level.jpeg";
import SecondFactorQR from "./second_factor_authentication/SecondFactorQR";
import JSCookies from 'js-cookie'

const player: Player = players[0];

const ProfileCard = () => {
  const [base64String, setBase64String] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const { loggedIn, setLoggedIn } = useMyContext();
  
  // dynamically calculating where the drowdown should start
  const firstElementRef = useRef<HTMLDivElement>(null);
  const secondElementRef = useRef<HTMLDivElement>(null);
  function handleProfileClick() {
    setIsDropdownOpen(!isDropdownOpen);
    if (firstElementRef.current && secondElementRef.current) {
      secondElementRef.current.style.top = `${
        firstElementRef.current.getBoundingClientRect().bottom
      }px`;
    }
  }

  // logginf the user out
  function logOut() {
    //remove the cookie
    JSCookies.remove('accessToken');
    //change the state to logged out 
    setLoggedIn(false);
    //redirect to the main screen
    window.location.replace("http://localhost:3000");
  }

  
  return (
    <div id="profile-box" ref={firstElementRef}>
      <span className="basic" onClick={handleProfileClick}>
        Profile
      </span>
      <img src={profile} alt="" />

      <div
        ref={secondElementRef}
        id="user-dropdown"
        style={{ display: isDropdownOpen ? "flex" : "none" }}
      >
        {levelAndUsername()}
        {statusAndGamesWon()}
        {achievements()}
        <ToggleBox setBase64String={setBase64String}/>
        {/* {toggleBox(setBase64String)} */}
        <button onClick={logOut}>Logout</button>

        {/* if 2fa is disabled or it has been previously enabled, do not show the QR code */}
        {base64String !== ""
        ? ( <SecondFactorQR qrString={base64String} />)
        : ( <div></div> )}
      </div>
    </div>
  );
};

function achievements() {
  return (
    <section id="achievements-box">
      <h3>Achievements</h3>
      <div id="achievements">
        <img src={themeAchievement} alt="" />
        <img src={halfGamesAchievement} alt="" />
        <img src={threeWinsAchievement} alt="" />
        <img src={threeWinsAchievement} alt="" />
        <img src={threeWinsAchievement} alt="" />
      </div>
    </section>
  );
}

function statusAndGamesWon() {
  return (
    <div id="status-games-won">
      <span
        id="status-dot"
        style={{ backgroundColor: player.availability ? "purple" : "gray" }}
      ></span>
      <span id="availability">
        {player.availability ? "ONLINE" : "OFFLINE"}
      </span>
      <span style={{ fontWeight: "bolder" }}>WINS {player.gamesWon} </span>
    </div>
  );
}

function levelAndUsername() {
  return (
    <div id="level-username">
      <img src={expertLevel} alt="" />
      <span>{player.name}</span>
    </div>
  );
}

interface Props {
  setBase64String: React.Dispatch<React.SetStateAction<string>>;
  // comingFromBackend: boolean;
}
const ToggleBox: React.FC<Props> = ({ setBase64String }) => {
  const COMING_FROM_BACKEND: boolean = true; 
  const [checked, setChecked] = useState<boolean>(COMING_FROM_BACKEND);

  async function handleCheckboxChange() {
    setChecked((prevChecked) => !prevChecked);

    //if the user went from unchecked to checked
    if (!checked) {
      console.log(`In here again.. ${checked}`);
      const myCookieValue = JSCookies.get("accessToken");
      //request a Base64String to create a QR code
      const response = await fetch("http://localhost:3003/2-fa/generate", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${myCookieValue}`,
        },
      },
      );

      //get the data as a string
      const dataBlob = await response.blob();
      const text = await dataBlob.text();

      //update the value so that a QR code is generated below
      setBase64String(text);
    } 
    else //from checked to uncheked
    {
      //update the value so that NO QR code is generated below
      setBase64String("");
      //disable 2f at backend
      const myCookieValue = JSCookies.get("accessToken");
      console.log(`Cookiee: ${myCookieValue}`);
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        return { ...acc, [name]: value };
      }, {});
      console.log(cookies);
      const response = await fetch('http://localhost:3003/2-fa/turn-off', {
        method: 'POST',
        headers: {
                    // Accept: "application/json",
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
      <span className="label-text">2FA</span>
      <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
      <span className="slider round"></span>
    </label>
  );
};

export default ProfileCard;