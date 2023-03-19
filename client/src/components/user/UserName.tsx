import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const UserName = () => {
  const { name } = useContext(UserContext);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>{`USERNAME: ${name}`}</div>
    </div>
  );
};

export default UserName;
