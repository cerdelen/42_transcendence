import expertLevel from "../../images/expert-level.jpeg";
import { players, Player } from "../../models/temp-players";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useMyContext } from "../../contexts/InfoCardContext";

interface Props {
  userName: string;
}

const LevelImageAndUsername = ({ userName }: Props) => {
  // const {userId} = useContext(UserContext);
  const { showUserInfo, setShowUserInto } = useMyContext();
  
  const goToUserPage = async () => {
    console.log("clicked");
    setShowUserInto(!showUserInfo);
      // window.location.assign(`http://localhost:3000/user?id=${userId}`);
  }
  
  return (
    <div id="level-username" onClick={goToUserPage}>
      <img src={expertLevel} alt="" />
      <span>{userName}</span>
    </div>
  );
};

export default LevelImageAndUsername;
