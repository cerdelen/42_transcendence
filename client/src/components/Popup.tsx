import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup"
import { useMyContext } from "../contexts/InfoCardContext";
import { UserContext } from "../contexts/UserContext";
import { our_socket } from "../utils/context/SocketContext";


type Props = {
  isInvited: boolean;
  setIsInvited: React.Dispatch<React.SetStateAction<boolean>>;
};

const PopUp = ({isInvited, setIsInvited} : Props) => {
    const navigate = useNavigate();
    // const {isInvited, setIsInvited} = useMyContext();
    const {userId} = useContext(UserContext);
    const [inviterName, setinviterName] = useState("");

    
    const  acceptInvite = () => {
      console.log("Invite accepted");
      setIsInvited(false);
      setinviterName("");
      navigate("/game");
      let obj = {inviterName: inviterName, userId: userId}
      our_socket.emit("playerAccepted", JSON.stringify(obj))
      console.log("player accepted the invitation ");
    }
    
    const rejectInvite = () => {
      if(isInvited === false)
        return ;
      console.log("Invite rejected");
      let obj = {inviterName: inviterName, userId: userId}
      our_socket.emit("rejectInvite", JSON.stringify(obj));
      setinviterName("");
      setIsInvited(false);
    }

    console.log(`POPUP status: ${isInvited}`);
    
    return (
        <Popup open={isInvited} position="right center" onClose={() => rejectInvite()} >
            <h2 style={{color: "black"}} >You've been invited to the game by {inviterName}</h2>
            <center>
                <button className="game_buttons" onClick={() => acceptInvite()}> Accept </button>
                <button className="game_buttons" onClick={() => rejectInvite()}> Reject </button>
            </center>
        </Popup>
    )
} 

export default PopUp;