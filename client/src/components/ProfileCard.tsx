// import React, { useContext } from "react";
import { useMyContext } from "./AppContext";
import { useRef, useState } from "react";
import { players, Player } from "../models/temp-players";
import profile from "../images/cat-grass.jpg";
import themeAchievement from "../images/changed-theme-achievement.png";
import threeWinsAchievement from "../images/three-wins-achievement.png";
import halfGamesAchievement from "../images/won-half-of-your-games-achievement.png";
import expertLevel from "../images/expert-level.jpeg";
import LoginPage from "./LoginPage";
import QRCode from 'qrcode.react';
import SecondFactorQR from "./SecondFactorQR";

const player: Player = players[0];

type Props = {};

const ProfileCard = (props: Props) => {
  const ENABLED_AT_BACKEND: boolean = true; /////NEED TO GET THIS
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const firstElementRef = useRef<HTMLDivElement>(null);
  const secondElementRef = useRef<HTMLDivElement>(null);
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

  // let checked: boolean = false;
  const [base64String, setBase64String] = useState('');
  const [checked, setChecked] = useState(true);
  // const []
  async function handleCheckboxChange() {
    // checked = !checked;
    console.log(checked);
    setChecked(!checked);
    if (checked)
    {
      // const response = await fetch('/2-fa/generate', {method: "POST",});
      // console.log(response);
      setBase64String("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");
      // console.log(base64String);
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
        <div id="level-username">
          <img src={expertLevel} alt="" />
          <span>{player.name}</span>
        </div>
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
        <label className="switch">
          <span className="label-text">2FA</span>
          <input type="checkbox" onChange={handleCheckboxChange}/>
          <span className="slider round"></span>
        </label>
        <button onClick={logOut}>Logout</button>
        {(base64String !== '' && ENABLED_AT_BACKEND)
        ?
        <SecondFactorQR qrString={base64String}/>
        :
        <div></div>
        // <QRCodeImage base64String={'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'} /> : <div></div>
        }
      </div>
    </div>
  );
};

export default ProfileCard;
