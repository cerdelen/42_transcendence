import ProfileCard from "./profile/ProfileCard";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { useMyContext } from "../contexts/InfoCardContext";

const Header = () => {
  const { setShowUserInto, setIsDropdownOpen, setShowMenu } = useMyContext();

  const closePopUps = () => {
    setShowUserInto(false);
    setIsDropdownOpen(false);
    setShowMenu(false);
  }

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
