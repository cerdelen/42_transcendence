import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup"
import { useUserContext } from "../contexts/UserContext";
import { CounterContext } from "../utils/context/CounterContext";
import { our_socket } from "../utils/context/SocketContext";

function CustomizationFields({ setMapNumber }: { setMapNumber: any }) {

  return (
      <>
          <br />
          <br />
          <button className="game_buttons" onClick={(e) => {
              e.preventDefault();
              setMapNumber(0);
          }}> Bulgaria </button>
          <button className="game_buttons" onClick={(e) => {
              e.preventDefault();
              setMapNumber(1);
          }}> Paris </button>
          <button className="game_buttons" onClick={(e) => {
              e.preventDefault();
              setMapNumber(2);
          }}> Cat Valley </button>
      </>
  )
}

type Props = {
  setInviterName: any;
  inviterName: any;
  isInvited: boolean;
  setIsInvited: React.Dispatch<React.SetStateAction<boolean>>;
};

const PopUp = ({setInviterName ,inviterName ,isInvited, setIsInvited} : Props) => {
    const navigate = useNavigate();
    const {myUserId} = useUserContext();
    const {mapNumber, setMapNumber} = useContext(CounterContext);
    const  acceptInvite = () => {
      console.log("Invite accepted");
      setIsInvited(false);
      setInviterName("");
      navigate("/game");
      let obj = {inviterName: inviterName, userId: myUserId}
      our_socket.emit("playerAccepted", JSON.stringify(obj))
      console.log("player accepted the invitation ");
    }
    
    const rejectInvite = () => {
      if(isInvited === false)
      {
        console.log("Is invited ");
        return ;
      }
      console.log("Invite rejected");
      let obj = {inviterName: inviterName, userId: myUserId}
      console.log("Inviter name == " , inviterName);
      our_socket.emit("rejectInvite", JSON.stringify(obj));
      setInviterName("");
      setIsInvited(false);
    }
    
    return (
        <Popup open={isInvited} position="right center" onClose={() => rejectInvite()} >
            <h2 style={{color: "black"}} >You've been invited to the game by {inviterName}</h2>
            <center>
                <CustomizationFields setMapNumber={setMapNumber} />
                <br/>
                <br/>
                <button className="game_buttons" onClick={() => acceptInvite()}> Accept </button>
                <button className="game_buttons" onClick={() => rejectInvite()}> Reject </button>
            </center>
        </Popup>
    )
} 

export default PopUp;