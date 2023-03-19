import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";
import defaultPicture from "../../images/default-picture.jpeg";

interface NameProps {
  playerOne: string;
  playerTwo: string;
  photoOne: string;
  photoTwo: string;
  scoreOne: string;
  scoreTwo: string;
}

const GameCard = ({
  photoOne,
  photoTwo,
  playerOne,
  playerTwo,
  scoreOne,
  scoreTwo,
}: NameProps) => {
  const leftOpponentWon = scoreOne > scoreTwo;

  return (
    <li className="game-card-li">
      <div
        id="game-card-left-opponent"
        className={leftOpponentWon ? "winner-left" : "loser-left"}
      >
        <img
          src={defaultPicture}
          alt="user1"
        />
        <span> {playerOne}</span>
        <span> {scoreOne}</span>
      </div>
      <span className="item2">vs</span>
      <div
        id="game-card-right-opponent"
        className={leftOpponentWon ? "loser-right" : "winner-right"}
      >
        <span> {scoreTwo}</span>
        <span> {playerTwo}</span>
        <img
          src={defaultPicture}
          alt="user1"
        />
      </div>
    </li>
  );
};

type Props = {
  gamesList: string[];
};

const GameHistory = ({ gamesList }: Props) => {
  const [friendsNames, setNames] = useState<string[]>([]);
  //   const [profilePictures, setProfilePictures] = useState<string[]>([]);
  useEffect(() => {
    // const fetchNames = async () => {
    //   const newlist = await Promise.all(
    //     gamesList.map(async (id) => {
    //       const response = await fetch("http://localhost:3003/user/user_name", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${JSCookies.get("accessToken")}`,
    //         },
    //         body: JSON.stringify({ user_id: id }),
    //       });
    //       const name = await response.text();
    //       return name;
    //     })
    //   );
    //   setNames(newlist);
    // };
    // const getUserPic = async () => {
    //   const newlist = await Promise.all(
    //     gamesList.map(async (id) => {
    //       const response = await fetch(`http://localhost:3003/pictures/${id}`, {
    //         method: "Get",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${JSCookies.get("accessToken")}`,
    //         },
    //       });
    //       const path = await response.blob();
    //       const url = URL.createObjectURL(path);
    //       return url;
    //       // setProfilePicture(url);
    //     })
    //   );
    //   setProfilePictures(newlist);
    // };
    // fetchNames();
    // getUserPic();
  }, [gamesList]);

  return (
    <ul className="user-info-lists">
      <div>Games:</div>
      <br />
      {[1, 2, 3].map((name, idx) => (
        <GameCard
          key={idx}
          photoOne={defaultPicture}
          photoTwo={defaultPicture}
          playerOne={"Player1"}
          playerTwo={"Player2"}
          scoreOne="3"
          scoreTwo="1"
        />
      ))}
    </ul>
  );
};

export default GameHistory;
