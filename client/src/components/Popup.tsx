import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup"
import { UserContext } from "../contexts/UserContext";
import { SocketContext, our_socket } from "../utils/context/SocketContext";



const PopUp = () => {
    const navigate = useNavigate();
    const { userId } = useContext(UserContext)
    const [isInvited, setIsInvited] = useState(false);
    const [inviterName, setinviterName] = useState("");
    useEffect(() => 
    {
        our_socket.on("invitationPopUp", (invitingUserName) =>
        {
          console.log("You've been invited mate");
          setinviterName(invitingUserName);
          setIsInvited(true);
        })
    }, [])
    
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


    return (
        <Popup open={isInvited} position="right center" onClose={rejectInvite} >
            <h2>You've been invited to the game by {inviterName}</h2>
            <center>
                <button className="game_buttons" onClick={acceptInvite}> Accept </button>
                <button className="game_buttons" onClick={rejectInvite}> Reject </button>
            </center>
        </Popup>
    )
} 

export default PopUp;