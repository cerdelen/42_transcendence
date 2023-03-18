import React, { useContext, useEffect, useState } from "react";
import JSCookies from "js-cookie";
import { UserContext } from "../../contexts/UserContext";
import { AiOutlineEdit } from "react-icons/ai";
import ListFriends from "./ListFriends";

type Props = {};

const UserPage = (props: Props) => {
  const { userId, name, mail, two_FA_enabled, friendlist, games, socket } =
    useContext(UserContext);

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
  const [newName, setNewName] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);

  const [userName, setUserName] = useState<string>(name);

  useEffect(() => {
    setUserName(name);
  }, [name]);

  const changeName = async () => {
    console.log("changeName called");
    try {
      const response = await fetch("http://localhost:3003/user/change_name", {
        method: "POST",
        body: JSON.stringify({ new_name: newName }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      });
      if (response.ok) {
        setShowInput(true);
        setNewName("");
        setUserName(newName);
        alert("Name was changed successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };


  const [names, setNames] = useState<string[]>([]);
  useEffect(() => {
    const fetchNames = async () => {
      const newlist = await Promise.all(
        friendlist.map(async (id) => {
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
        setNames(newlist)
    };

    const fetchGames = async () => {
      const newlist = await Promise.all(
        friendlist.map(async (id) => {
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
        setNames(newlist)
    }
    fetchNames();
  }, [friendlist]);

  const handleNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value); // Update the newName state variable when the input field changes
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeName();
  };

  return (
    <div>
      UserPage
      <div>{`This is ${userId}`}</div>
      {/* <div>{`This is name ${name}`}</div> */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>{`USERNAME: ${userName}`}</div>
        <div
          onClick={() => {
            setShowInput(!showInput);
          }}
          style={{ marginLeft: "10px", cursor: "pointer" }}
        >
          <AiOutlineEdit />
        </div>
        {showInput && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newName}
              onChange={handleNewNameChange}
              minLength={3}
              pattern="^\S*$"
              title="Name should be at least 3 characters long and should not contain any spaces"
            />
            <button>Change Name</button>
          </form>
        )}
      </div>
      <div>{`This is email: ${mail}`}</div>
      <div>{`This is 2FA enabled: ${two_FA_enabled}`}</div>
      <ListFriends names={names}/>
      {/* <div>{`This is your stats: ${sta}`}</div> */}
      <div>{`This is your games: ${games}`}</div>
    </div>
  );
};

export default UserPage;
