import React, { useContext, useEffect, useState } from "react";
import JSCookies from "js-cookie";
import { UserContext } from "../../contexts/UserContext";
import { AiOutlineEdit } from "react-icons/ai";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import ListFriends from "./ListFriends";
import UserName from "./UserName";
import UserPhoto from "./UserPhoto";
import { useMyContext } from "../../contexts/InfoCardContext";
import GameHistory from "./GamesHistory";
import UserStats from "./UserStatistics";
import { our_socket } from "../../utils/context/SocketContext";
import { Link } from "react-router-dom";

const UserPage = () => {
  const { userId, blocked_users } = useContext(UserContext);
  const { userIdCard, setShowUserInto } = useMyContext();
  const [isVisible, setIsVisible] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [TFA, setTFA] = useState(false);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [gamesList, setGamesList] = useState([]);
  const isMe = userId === userIdCard;
  const [isFriend, setIsFriend] = useState(false);
  const [is_blocked, set_is_blocked] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setShowUserInto(false);
  };

  const startChat = async () => {
    console.log("%cSTART CHAT", "color: green");
    
    try {
      our_socket.emit("create_dialogue", {
        userid_creator: userId,
        other_user: userIdCard,
      });
    } catch (error) {
      alert("Could not go to chat");
    }

    //TO ADD if chat is already open, go to it
  };

  const update_is_blocked = async () => {
    if (!is_blocked) {
      try {
        const response = await fetch(
          `http://localhost:3003/user/block_user/${userIdCard}`,
          {
            method: "Get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSCookies.get("accessToken")}`,
            },
          }
        );
        set_is_blocked(true);
      } catch (error) {
        alert("Could not modify friends list");
      }
    }
    else {
      try {
        const response = await fetch(`http://localhost:3003/user/unblock_user/${userIdCard}`, {
          method: "Get",
          headers: {
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        });
        set_is_blocked(false);
      } catch (error) {
        alert("Could not modify friends list");
      }
    }
  }

  const updateFriendsList = async () => {
    if (isFriend) {
      try {
        const response = await fetch(
          "http://localhost:3003/user/remove_friend",
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
    } else {
      try {
        const response = await fetch("http://localhost:3003/user/add_friend", {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
          body: JSON.stringify({ adding_you: userIdCard }),
        });
        console.log(response);
        setIsFriend(true);
      } catch (error) {
        alert("Could not modify friends list");
      }
    }
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
      setIsFriend(data["friendlist"].includes(Number(userId)));
      set_is_blocked(blocked_users.includes(Number(userIdCard)));
    };
    if (userIdCard) getData();
  }, [userIdCard, isFriend]);

  function startAndinvitePlayers(userId: string, userName: string) {
    console.log(userId + " Inviting player " + userName);
    setShowUserInto(false);
    let obj: any = { userId: userId, userName: userName };

    our_socket.emit("createInvitationRoom", JSON.stringify(obj));
  }
  return (
    <div id="userInfo">
      <div id="stats">
        <div>
          <UserPhoto userId={userIdCard} />
        </div>
        <div id="generic-info">
          <span>{`Player: ${userName}`}</span>
          <span>{`Email: ${userEmail}`}</span>
          {isMe ? <span>{`2FA enabled: ${TFA}`}</span> : <span></span>}
              {!isMe &&
                <div id="buttons">
                  <button className="purple-button" onClick={startChat}>
                    Chat
                  </button>
                  <Link to="/game">
                    <button
                      className="purple-button"
                      onClick={() => startAndinvitePlayers(userId, userName)}
                    >
                      Play
                    </button>
                  </Link>
                  <button className="purple-button" onClick={updateFriendsList}>
                    {isFriend ? "Unfriend" : "Friend"}
                  </button>
                  <button className="purple-button" onClick={update_is_blocked}>
                    {is_blocked ? "Unblock" : "Block"}
                  </button>
                </div>
              }
            </div>
        <UserStats userId={userIdCard} />
        </div>
      <button id="exit-buttton" onClick={toggleVisibility}>
        X
      </button>
      <div id="lists">
        <ListFriends friendsList={friendsList} />
        <GameHistory gamesList={gamesList} />
      </div>
    </div >
  );
};

export default UserPage;
