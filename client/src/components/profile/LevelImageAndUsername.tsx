import expertLevel from "../../images/expert-level.jpeg";
import { players, Player } from "../../models/temp-players";

const player: Player = players[0];
const LevelImageAndUsername = () => {
  return (
    <div id="level-username">
      <img src={expertLevel} alt="" />
      <span>{player.name}</span>
    </div>
  );
};

export default LevelImageAndUsername;
