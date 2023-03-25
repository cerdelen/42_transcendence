import React, { useContext, useEffect, useState } from "react";
import JSCookies from "js-cookie";
import { UserContext } from "../../contexts/UserContext";
import { AiOutlineEdit } from "react-icons/ai";
import ListFriends from "./ListFriends";
import UserName from "./UserName";
import UserPhoto from "./UserPhoto";
import { useMyContext } from "../../contexts/InfoCardContext";
import GameHistory from "./GamesHistory";
import UserStats from "./UserStatistics";

type Props = {
  // setShowUserInto: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserPage = ({}: Props) => {
  const { userId } = useContext(UserContext);
  const { userIdCard, setUserIdCard } = useMyContext();

  const [isVisible, setIsVisible] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [TFA, setTFA] = useState(false);
  const { setShowUserInto } = useMyContext();
  const [friendsList, setFriendsList] = useState([]);
  const [gamesList, setGamesList] = useState([]);
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

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setShowUserInto(false);
  };
  useEffect(() => {
    const getData = async () => {
      const response = await fetch("http://localhost:3003/user/user_data", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: JSON.stringify({ user_id: userIdCard }),
      });
      const data = await response.json();
      setUserName(data["name"]);
      setUserEmail(data["mail"]);
      setTFA(data["two_FA_enabled"]);
      setFriendsList(data["friendlist"]);
      setGamesList(data["games"]);
    };
    if (userIdCard) getData();
  }, [userIdCard]);
  return (
    <>
      {true && (
        <div id="userInfo">
          <div id="stats">
            <div>
              <UserPhoto userId={userIdCard} />
            </div>

            <div id="generic-info">
              <span>{`Player: ${userName}`}</span>
              <span>{`Email: ${userEmail}`}</span>
              {
                userId === userIdCard ? 
              <span>{`2FA enabled: ${TFA}`}</span> : <span></span>
              }
            </div>
            <UserStats userId={userIdCard}/>
            {/* <div>{`This is your stats: ${0}`}</div> */}

          </div>
            <button id="exit-buttton" onClick={toggleVisibility}>X</button>
          <div id="lists">
            <ListFriends friendsList={friendsList} />
            <GameHistory gamesList={gamesList} />
          </div>
        </div>
      )}
    </>
  );
};

export default UserPage;



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