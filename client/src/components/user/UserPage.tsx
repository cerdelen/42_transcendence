import React, { useContext, useEffect, useState } from "react";
import JSCookies from "js-cookie";
import { UserContext } from "../../contexts/UserContext";
import { AiOutlineEdit } from "react-icons/ai";
import ListFriends from "./ListFriends";
import UserName from "./UserName";
import UserPhoto from "./UserPhoto";
import { useMyContext } from "../../contexts/InfoCardContext";

type Props = {
  // setShowUserInto: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserPage = ({}: Props) => {
  const { userId, mail, two_FA_enabled, games } =
    useContext(UserContext);
    
    const { userIdCard, setUserIdCard } = useMyContext();
  type Game = {
    id: number;
    player_one: number;
    player_two: number;
    winner: number;
    loser: number;
    score_one: number;
    score_two: number;
    finished: boolean;
  };

  const initialGames: Game[] = [];

  const [gamesHistory, setGamesHistory] = useState<Game[]>(initialGames);
  const [photoURL, setPhotoURL] = useState<string>("");

  useEffect(() => {
    const getUserPic = async () => {
      const response = await fetch(`http://localhost:3003/pictures/${userId}`, {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      });
      const path = await response.blob();
      const url = URL.createObjectURL(path);
      setPhotoURL(url);
    };
    getUserPic();
  }, []);

  const [isVisible, setIsVisible] = useState(true);
  const { setShowUserInto } = useMyContext();
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setShowUserInto(false);

  };
  return (
    <>
      {isVisible && (
        <div id="userInfo">
          <button onClick={toggleVisibility}>Close</button>
          UserPage
          {/* <img src={photoURL} /> */}
          <UserPhoto />
          <div>{`This is ${userId}`}</div>
          <UserName />
          <div>{`This is email: ${mail}`}</div>
          <div>{`This is 2FA enabled: ${two_FA_enabled}`}</div>
          <ListFriends />
          {/* <div>{`This is your stats: ${sta}`}</div> */}
          <div>{`This is your games: ${games}`}</div>
        </div>
      )}
    </>
  );
}

export default UserPage;
