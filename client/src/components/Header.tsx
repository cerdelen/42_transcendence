import React from "react";
import ProfileCard from "./profile/ProfileCard";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../contexts/InfoCardContext";

type Props = {
  setGamePage: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = () => {
  // const navigate = useNavigate();
  const { setShowUserInto, setIsDropdownOpen } = useMyContext();
  // const {setShowUserInto} = useMyContext();

  const closePopUps = () => {
    setShowUserInto(false);
    setIsDropdownOpen(false);

    // navigate("/game")
  }

  // const closePopUpsTwo = () => {
  //   setShowUserInto(false);
  //   navigate("/game")
  // }
  return (
    <header>
      <Link to="/">
        <img src={logo} alt="" id="logo" />
      </Link>
      <nav>
        <ul>
          <Link className="nav-link basic" onClick={closePopUps} to="/game">Game</Link>
          <Link className="nav-link basic" onClick={closePopUps} to="/community">Community</Link>
          <Link className="nav-link basic" onClick={closePopUps} to="/ladder">Ladder</Link>
        </ul>
      </nav>
      <ProfileCard />
    </header>
  );
};

export default Header;
