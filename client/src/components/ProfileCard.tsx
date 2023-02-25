import React, { useContext } from "react";
import { useMyContext } from "./AppContext";
import { useRef, useState } from "react";
import { players, Player } from "../models/temp-players";
import profile from "../images/cat-grass.jpg";
import themeAchievement from "../images/changed-theme-achievement.png";
import threeWinsAchievement from "../images/three-wins-achievement.png";
import halfGamesAchievement from "../images/won-half-of-your-games-achievement.png";
import expertLevel from "../images/expert-level.jpeg";
import LoginPage from "./LoginPage";

const player: Player = players[0];

type Props = {};

const ProfileCard = (props: Props) => {
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
  return (
    <div id="profile-box" ref={firstElementRef}>
      <span onClick={handleProfileClick}>Profile</span>
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
        <button>TwoFactor</button>
        <button onClick={logOut}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileCard;
