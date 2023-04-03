import expertLevel from "../../images/expert-level.jpeg";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useMyContext } from "../../contexts/InfoCardContext";
import JSCookies from "js-cookie";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";
const ipAddress = process.env.REACT_APP_Server_host_ip;

interface Props {
  userName: string;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LevelImageAndUsername = ({ userName, setIsDropdownOpen }: Props) => {
  const { userId } = useContext(UserContext);
  const [showInput, setShowInput] = useState<boolean>(false);
  const { showUserInfo, setShowUserInto, setUserIdCard } = useMyContext();
  const [photo, setPhoto] = useState("");
  const [newName, setNewName] = useState<string>("");
  const { picture_map, set_picture_map, pushPictureToMap } = useMyProfile_picture_Context();
  useEffect(() => {
    const get_user_photo = async () => {
      if (userId == "")
        return ;
      if(picture_map.has(Number(userId)))
        setPhoto(picture_map.get(Number(userId)) ?? '')
      else
        setPhoto(await pushPictureToMap(Number(userId), picture_map, set_picture_map));
    };
    get_user_photo();
    setNewName(userName);
  }, [userName, userId]);

  const toggleInputField = async () => {
    setShowInput(!showInput);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeName();
  };

  const handleNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.value);

    setNewName(event.target.value);
  };

  const changeName = async () => {
    // console.log("changeName called");
    try {
      const response = await fetch(`http://${ipAddress}:3003/user/change_name`, {
        method: "POST",
        body: JSON.stringify({ new_name: newName }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      });
      if (response.ok) {
        setShowInput(false);
        setNewName(newName);
        // setUserName(newName);
        // alert("Name was changed successfully");
      }
    } catch (error) {
      console.error(error);
      // alert("Something went wrong");
    }
  };

  return (
    <div id="level-username">
      <img
        onClick={() => {
          setIsDropdownOpen(false);
          setShowUserInto(!showUserInfo);
          setUserIdCard(userId);
        }}
        src={photo}
        alt=""
      />
      {showInput ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={handleNewNameChange}
            minLength={3}
            placeholder="Enter new name"
            pattern="^\S*$"
            title="Name should be at least 3 characters long and should not contain any spaces"
          />
          <button>Change Name</button>
        </form>
      ) : (
        <span title="Change name" onClick={toggleInputField}>
          {newName}
        </span>
      )}
    </div>
  );
};

export default LevelImageAndUsername;
