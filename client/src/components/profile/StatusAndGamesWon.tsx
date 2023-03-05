import { players, Player } from "../../models/temp-players";
const player: Player = players[0];

type Props = {};

const StatusAndGamesWon = (props: Props) => {
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
};

export default StatusAndGamesWon;
