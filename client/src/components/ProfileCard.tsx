// import React, { useContext } from "react";
import { useMyContext } from "./AppContext";
import { useRef, useState } from "react";
import { players, Player } from "../models/temp-players";
import profile from "../images/cat-grass.jpg";
import themeAchievement from "../images/changed-theme-achievement.png";
import threeWinsAchievement from "../images/three-wins-achievement.png";
import halfGamesAchievement from "../images/won-half-of-your-games-achievement.png";
import expertLevel from "../images/expert-level.jpeg";
import SecondFactorQR from "./SecondFactorQR";

const player: Player = players[0];

type Props = {};

const ProfileCard = (props: Props) => {
  const ENABLED_AT_BACKEND: boolean = true; /////NEED TO GET THIS
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const firstElementRef = useRef<HTMLDivElement>(null);
  const secondElementRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loggedIn, setLoggedIn } = useMyContext();

  function handleProfileClick() {
    setIsDropdownOpen(!isDropdownOpen);

    if (firstElementRef.current && secondElementRef.current) {
      secondElementRef.current.style.top = `${
        firstElementRef.current.getBoundingClientRect().bottom
      }px`;
    }
  }
  
   function logOut() {
    console.log("pressed");

    document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    setLoggedIn(false);
    window.location.replace('http://localhost:3000');
  }

  const [base64String, setBase64String] = useState('');
  const [checked, setChecked] = useState(true);
  async function handleCheckboxChange() {
    console.log(checked);
    setChecked(!checked);
    if (checked)
    {
      // const response = await fetch('/2-fa/generate', {method: "POST",});
      // console.log(response);
      setBase64String("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");
    }
    else {
      setBase64String('');
    }
  }
  return (
    <div id="profile-box" ref={firstElementRef}>
      <span className="basic" onClick={handleProfileClick}>Profile</span>
      <img src={profile} alt="" />

      <div
        ref={secondElementRef}
        id="user-dropdown"
        style={{ display: isDropdownOpen ? "flex" : "none" }}
      >
        {levelAndUsername()}
        {statusAndGamesWon()}
        {achievements()}
        {toggleBox(handleCheckboxChange)}
        <button onClick={logOut}>Logout</button>
        {(base64String !== '' && ENABLED_AT_BACKEND)
        ?
        <SecondFactorQR qrString={base64String}/>
        :
        <div></div>
        }
      </div>
    </div>
  );
};

export default ProfileCard;
function achievements() {
  return <section id="achievements-box">
    <h3>Achievements</h3>
    <div id="achievements">
      <img src={themeAchievement} alt="" />
      <img src={halfGamesAchievement} alt="" />
      <img src={threeWinsAchievement} alt="" />
      <img src={threeWinsAchievement} alt="" />
      <img src={threeWinsAchievement} alt="" />
    </div>
  </section>;
}

function statusAndGamesWon() {
  return <div id="status-games-won">
    <span
      id="status-dot"
      style={{ backgroundColor: player.availability ? "purple" : "gray" }}
    ></span>
    <span id="availability">
      {player.availability ? "ONLINE" : "OFFLINE"}
    </span>
    <span style={{ fontWeight: "bolder" }}>WINS {player.gamesWon} </span>
  </div>;
}

function levelAndUsername() {
  return <div id="level-username">
    <img src={expertLevel} alt="" />
    <span>{player.name}</span>
  </div>;
}

function toggleBox(handleCheckboxChange: () => Promise<void>) {
  return <label className="switch">
    <span className="label-text">2FA</span>
    <input type="checkbox" onChange={handleCheckboxChange} />
    <span className="slider round"></span>
  </label>;
}

