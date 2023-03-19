import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

interface Props {
  userName: string;
}

const UserName = ({userName}: Props) => {

  return (
      <div>{`USERNAME: ${userName}`}</div>
  );
};

export default UserName;
