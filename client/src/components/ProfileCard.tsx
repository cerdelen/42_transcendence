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
    window.location.replace("http://localhost:3000");
  }

  const [base64String, setBase64String] = useState("");
  const [checked, setChecked] = useState(true);
  async function handleCheckboxChange() {
    console.log(checked);
    setChecked(!checked);
    if (checked) {

      const myCookieValue = document.cookie
      .split('; ')
      .find(cookie => cookie.startsWith('accessToken='))
      ?.split('=')[1];

      console.log(myCookieValue);
      const response = await fetch("http://localhost:3003/2-fa/generate", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${myCookieValue}`
        },
      });
      const dataBlob = await response.blob();
      const text = await dataBlob.text();
      console.log(text);
      setBase64String(text);
    } else {
      setBase64String("");
    }
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
        {toggleBox(handleCheckboxChange)}
        <button onClick={logOut}>Logout</button>
        {base64String !== "" && ENABLED_AT_BACKEND ? (
          <SecondFactorQR qrString={base64String} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
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

function toggleBox(handleCheckboxChange: () => Promise<void>) {
  return (
    <label className="switch">
      <span className="label-text">2FA</span>
      <input type="checkbox" onChange={handleCheckboxChange} />
      <span className="slider round"></span>
    </label>
  );
}
