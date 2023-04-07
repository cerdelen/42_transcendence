import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import { useMyContext } from "../../contexts/InfoCardContext";
import JSCookies from "js-cookie";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";
import ipAddress from '../../constants';

interface Props {
  userName: string;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LevelImageAndUsername = ({ userName, setIsDropdownOpen }: Props) => {
  const { myUserId } = useUserContext();
  const [showInput, setShowInput] = useState<boolean>(false);
  const { setShowUserInto, setUserIdCard } = useMyContext();
  const [photo, setPhoto] = useState("");
  const [newName, setNewName] = useState<string>("");
  const { picture_map, set_picture_map, pushPictureToMap } = useMyProfile_picture_Context();
  useEffect(() => {
    const get_user_photo = async () => {
      if (myUserId == "")
        return ;
      if(picture_map.has(Number(myUserId)))
        setPhoto(picture_map.get(Number(myUserId)) ?? '')
      else
        setPhoto(await pushPictureToMap(Number(myUserId), picture_map, set_picture_map));
    };
    get_user_photo();
    setNewName(userName);
  }, [userName, myUserId]);

  const toggleInputField = async () => {
    setShowInput(!showInput);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeName();
  };

  const handleNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const changeName = async () => {
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="level-username">
      <img
        onClick={() => {
          setIsDropdownOpen(false);
          setShowUserInto(true);
          setUserIdCard(myUserId);
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
        <span id="name-in-profile-card" title="Change name" onClick={toggleInputField}>
          {newName}
        </span>
      )}
    </div>
  );
};

export default LevelImageAndUsername;
