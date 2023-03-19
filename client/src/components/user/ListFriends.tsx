import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";

interface NameProps {
  name: string;
  pic: string;
}

const NameComponent = ({ name, pic }: NameProps) => {
  return (
    <li id="friend-card">
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
  useEffect(() => {
    const fetchNames = async () => {
    try {
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
    } catch (error) {
      console.error(`fetch Names in ListFriends failed: ${error}`);
    }
      
    };

    const getUserPic = async () => {
      try {
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
    <ul className="user-info-lists">
      <div>Friends:</div>
      <br />
      {friendsNames.map((name, idx) => (
        <NameComponent key={name} name={name} pic={profilePictures[idx]} />
      ))}
    </ul>
  );
};

export default ListFriends;
