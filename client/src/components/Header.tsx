import React from "react";
import ProfileCard from "./profile/ProfileCard";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

type Props = {
  setGamePage: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = () => {
  return (
    <header>
      <Link to="/">
        <img src={logo} alt="" id="logo" />
      </Link>
      <nav>
        <ul>
          <Link className="nav-link basic" to="/game">Game</Link>
          <Link className="nav-link basic" to="/community">Community</Link>
          <Link className="nav-link basic" to="/ladder">Ladder</Link>
        </ul>
      </nav>
      <ProfileCard />
    </header>
  );
};

export default Header;
