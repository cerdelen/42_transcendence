import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";
import defaultPicture from "../../images/default-picture.jpeg";
import pic from "../../images/cat-stern.jpeg";


interface NameProps {
  playerOne: string;
  playerTwo: string;
  photoOne: string;
  photoTwo: string;
  scoreOne: string;
  scoreTwo: string;
}

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
          src={photoOne}
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
          src={photoTwo}
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
  const [games, setGames] = useState<Game[]>([]);
  const [playerOnes, setplayerOnes] = useState<string[]>([]);
  const [playerTwos, setPlayerTwos] = useState<string[]>([]);
  const [profilePicturesPlayerOne, setPicturesPlayerOne] = useState<string[]>([]);
  const [profilePicturesPlayerTwo, setPicturesPlayerTwo] = useState<string[]>([]);
  useEffect(() => {
    const fetchGames = async () => {

      try {
           const gamesListy = await fetch(`http://localhost:3003/game/many_games_data`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: JSON.stringify({ game_ids: gamesList}),
      });
      
      const allGames = await gamesListy.json();
        setGames(allGames);
        // fetchNamesOponentOne(allGames);
        // fetchNamesOponentTwo(allGames);
        // getPicturePlayerOne(allGames);
        // getPicturePlayerTwo(allGames);
      } catch (error) {
        console.error(`fetch games in GamesHistory failed: ${error}`);
        
      }
   
    };

    const fetchNamesOponentOne = async (gamesListy: any) => {
      const newlist = await Promise.all(
        gamesListy.map(async (game: any) => {
          const id = game['player_one'];
          const response = await fetch(`http://localhost:3003/user/user_name`, {
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
      setplayerOnes(newlist);
    };
    
    const fetchNamesOponentTwo = async (gamesListy: any) => {
      const newlist = await Promise.all(
        gamesListy.map(async (game: any) => {
          const id = game['player_two'];
          const response = await fetch(`http://localhost:3003/user/user_name`, {
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
        setPlayerTwos(newlist);
      };
      const getPicturePlayerOne = async (gamesListy: any) => {
        const newlist = await Promise.all(
          gamesListy.map(async (game: any) => {
            const response = await fetch(`http://localhost:3003/pictures/${game['player_one']}`, {
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
        setPicturesPlayerOne(newlist);
      };

      const getPicturePlayerTwo= async (gamesListy: any) => {
        const newlist = await Promise.all(
          gamesListy.map(async (game: any) => {
            const response = await fetch(`http://localhost:3003/pictures/${game['player_two']}`, {
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
        setPicturesPlayerTwo(newlist);
      };

    fetchGames();

    // getUserPic();
  }, [gamesList]);

  return (
    <ul className="user-info-lists">
      <div>Games:</div>
      <br />
      {games.map((game, idx) => (
        <GameCard
          key={game['id']}
          photoOne={profilePicturesPlayerOne[idx]}
          photoTwo={profilePicturesPlayerTwo[idx]}
          playerOne={playerOnes[idx]}
          playerTwo={playerTwos[idx]}
          scoreOne={game["score_one"].toString()}
          scoreTwo={game["score_two"].toString()}
        />
      ))}
    </ul>
  );
};

export default GameHistory;
