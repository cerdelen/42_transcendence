import expertLevel from "../../images/expert-level.jpeg";
import { players, Player } from "../../models/temp-players";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const player: Player = players[0];
const LevelImageAndUsername = () => {
  const {userId} = useContext(UserContext);


  const goToUserPage = async () => {
      window.location.assign(`http://localhost:3000/user?id=${userId}`);
  }
  
  return (
    <div id="level-username" onClick={goToUserPage}>
      <img src={expertLevel} alt="" />
      <span>{player.name}</span>
    </div>
  );
};

export default LevelImageAndUsername;
