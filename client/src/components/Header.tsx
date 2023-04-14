import ProfileCard from "./profile/ProfileCard";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { useMyContext } from "../contexts/InfoCardContext";
import { our_socket } from "../utils/context/SocketContext";
import { useUserContext } from "../contexts/UserContext";

const Header = () => {
  const { setShowUserInto, setIsDropdownOpen, setShowMenu } = useMyContext();
  const { gameInvited , myUserId, gameActive,setGameActive, gameStarted, setGameStarted} = useUserContext();

  const closePopUps = () => {
    setShowUserInto(false);
    setIsDropdownOpen(false);
    setShowMenu(false);
    console.log("game invited is " ,gameInvited);
    if(gameInvited)
    {
      setGameActive(true);
      return ;
    }
    if(gameActive && !gameStarted)
    {
      setGameActive(false);
      our_socket.emit("remove_from_quene", myUserId);
    }else if(gameStarted && gameActive)
    {
      console.log("Disconnect ran");
      // setGameActive(false);
      // setGameStarted(false);
      // our_socket.emit("player_disconnected", myUserId);
    }
  }

  return (
    <header>
      <Link to="/">
        <img src={logo} alt="" onClick={closePopUps}  id="logo" />
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