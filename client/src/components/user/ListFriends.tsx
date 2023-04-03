import { useEffect, useState } from "react";
import JSCookies from "js-cookie";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";
import EverythingIsFine from "../../svg/everything-is-fine.svg"
const ipAddress = process.env.REACT_APP_Server_host_ip;

interface NameProps {
  name: string;
  pic: string;
}

const NameComponent = ({ name, pic }: NameProps) => {
  return (
    <li className="friend-card">
      <img
        src={pic}
        alt="userPhoto"
        style={{ width: "64px", height: "64px" }}
      />
      <span>{name}</span>
    </li>
  );
};

type Props = {
  friendsList: string[];
};

const ListFriends = ({ friendsList }: Props) => {
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
          <NameComponent key={name} name={name} pic={profilePictures[idx]} />
        ))
      )}
    </ul>
  );
};

export default ListFriends;
