import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";

interface NameProps {
  name: string;
  pic: string;
}

const NameComponent = ({ name, pic }: NameProps) => {
  return (
    <li id='open-chat-card' style={{ maxWidth: "264px",}}>
      {name}
      <img src={pic} alt="userPhoto" style={{ width: "64px", height: "64px" }} />

    </li>
  );
};

type Props = {
  friendsList: string[];
};

const ListFriends = ({friendsList} : Props) => {
  // const { friendlist } = useContext(UserContext);
  const [friendsNames, setNames] = useState<string[]>([]);
  const [profilePictures, setProfilePictures] = useState<string[]>([]);
  useEffect(() => {
    const fetchNames = async () => {
      const newlist = await Promise.all(
        friendsList.map(async (id) => {
          const response = await fetch("http://localhost:3003/user/user_name", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSCookies.get("accessToken")}`,
            },
            body: JSON.stringify({ user_id: id }),
          });
          const name = await response.text();
          return name;
        })
      );
      setNames(newlist);
    };

    const getUserPic = async () => {
      const newlist = await Promise.all(
        friendsList.map(async (id) => {
          const response = await fetch(`http://localhost:3003/pictures/${id}`, {
            method: "Get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSCookies.get("accessToken")}`,
            },
          });
          const path = await response.blob();
          const url = URL.createObjectURL(path);
          return url;
          // setProfilePicture(url);
        })
      );
      setProfilePictures(newlist);
    };

    fetchNames();
    getUserPic();
  }, [friendsList]);

  return (
    <ul>
      Friends:
      {friendsNames.map((name, idx) => (
        <NameComponent key={name} name={name} pic={profilePictures[idx]} />
      ))}
    </ul>
  );
};

export default ListFriends;
