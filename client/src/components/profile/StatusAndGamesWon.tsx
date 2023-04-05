import { useContext } from "react";
import { Online_users_context } from "../../contexts/Online_users_context";
import { players, Player } from "../../models/temp-players";
const player: Player = players[0];

type Props = {
  wins: number;
};

const StatusAndGamesWon = (props: Props) => {
	const { online_users } = useContext(Online_users_context);

  return (
    <div id="status-games-won">
      <span
        id="status-dot"
        style={{backgroundColor: "purple"}}
      ></span>
      <span id="availability">
        {"ONLINE" }
      </span>
      <span style={{ fontWeight: "bolder" }}>WINS {props.wins} </span>
    </div>
  );
};

export default StatusAndGamesWon;
