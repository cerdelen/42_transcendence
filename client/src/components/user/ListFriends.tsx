import { useContext, useEffect, useState } from "react";
import JSCookies from "js-cookie";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";
import EverythingIsFine from "../../svg/everything-is-fine.svg";
import { useMyContext } from "../../contexts/InfoCardContext";
import { UserContext } from "../../contexts/UserContext";
const ipAddress = process.env.REACT_APP_Server_host_ip;

interface NameProps {
  name: string;
  pic: string;
  setIsFriend: React.Dispatch<React.SetStateAction<boolean>>;
}

const NameComponent = ({ name, pic, setIsFriend }: NameProps) => {
  const { userIdCard } = useMyContext();
  const { userId } = useContext(UserContext);

  const remove_friend = async () => {
    try {
      const response = await fetch(
        `http://${ipAddress}:3003/user/remove_friend`,
        {
          method: "Put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
          body: JSON.stringify({ removing_you: userIdCard }),
        }
      );
      console.log(response);
      setIsFriend(false);
    } catch (error) {
      alert("Could not modify friends list");
    }
  };

  return (
    <li className="friend-card">
      <img
        src={pic}
        alt="userPhoto"
        style={{ width: "64px", height: "64px" }}
      />
      {userId == userIdCard ? (
        <button className="deep-purple-button" onClick={remove_friend}>
          Remove
        </button>
      ) : (
        <></>
      )}
      <span>{name}</span>
    </li>
  );
};

type Props = {
  friendsList: string[];
  setIsFriend: React.Dispatch<React.SetStateAction<boolean>>;
  toggle_friends_or_requests: () => void;
  show_friends: boolean;
};

const ListFriends = ({
  friendsList,
  setIsFriend,
  toggle_friends_or_requests,
  show_friends,
}: Props) => {
  // const { friendlist } = useContext(UserContext);
  const [friendsNames, setNames] = useState<string[]>([]);
  const [profilePictures, setProfilePictures] = useState<string[]>([]);
  const { picture_map, set_picture_map, pushPictureToMap } =
    useMyProfile_picture_Context();
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const newlist = await Promise.all(
          friendsList.map(async (id) => {
            const response = await fetch(
              `http://${ipAddress}:3003/user/user_name`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${JSCookies.get("accessToken")}`,
                },
                body: JSON.stringify({ user_id: id }),
              }
            );
            const name = await response.text();
            return name;
          })
        );
        setNames(newlist);
      } catch (error) {
        console.error(`fetch Names in ListFriends failed: ${error}`);
      }
    };

    const getUserPic = async () => {
      try {
        const newlist = await Promise.all(
          friendsList.map(async (id) => {
            if (picture_map.has(Number(id))) {
              return picture_map.get(Number(id)) ?? "";
            }
            return pushPictureToMap(Number(id), picture_map, set_picture_map);
          })
        );
        setProfilePictures(newlist);
      } catch (error) {
        console.error(`fetch getUserPic in ListFriends failed: ${error}`);
      }
    };

    fetchNames();
    getUserPic();
  }, [friendsList]);

  return (
    <ul className="user-info-lists right-border">
      <div className="title-section">Friends:</div>
      <br />
      {friendsNames.length === 0 ? (
        <img className="everything-is-fine-svg" src={EverythingIsFine} alt="" />
      ) : (
        friendsNames.map((name, idx) => (
          <NameComponent
            key={name}
            name={name}
            pic={profilePictures[idx]}
            setIsFriend={setIsFriend}
          />
        ))
      )}
      <button className="purple-button" onClick={toggle_friends_or_requests}>
        {show_friends ? "Show Friend Requests" : "Show Your Friend"}
      </button>
    </ul>
  );
};

export default ListFriends;
