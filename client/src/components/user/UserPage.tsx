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
import { CounterContext } from "../../utils/context/CounterContext";
import Incoming_friend_requests from "./Incoming_friend_requests";
const ipAddress = process.env.REACT_APP_Server_host_ip;

function CustomizationFields({ setMapNumber }: { setMapNumber: any }) {
  return (
    <>
      <br />
      <br />
      <button
        className="purple-button_"
        onClick={(e) => {
          e.preventDefault();
          setMapNumber(0);
        }}
      >
        {" "}
        Bulgaria{" "}
      </button>
      <button
        className="purple-button_"
        onClick={(e) => {
          e.preventDefault();
          setMapNumber(1);
        }}
      >
        {" "}
        Paris{" "}
      </button>
      <button
        className="purple-button_"
        onClick={(e) => {
          e.preventDefault();
          setMapNumber(2);
        }}
      >
        {" "}
        Cat Valley{" "}
      </button>
    </>
  );
}

const UserPage = () => {
  const { mapNumber, setMapNumber } = useContext(CounterContext);
  const { userId, blocked_users } = useContext(UserContext);
  const { userIdCard, setShowUserInto } = useMyContext();
  const [isVisible, setIsVisible] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [TFA, setTFA] = useState(false);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [out_going_friend_requests, set_outgoing_friend_requests] = useState<
    string[]
  >([]);
  const [incoming_frined_requests, set_incoming_friend_requests] = useState<
    number[]
  >([]);
  const [gamesList, setGamesList] = useState([]);
  const isMe = userId === userIdCard;
  const [isFriend, setIsFriend] = useState(false);
  const [is_blocked, set_is_blocked] = useState(false);
  const [show_friends, set_show_friends] = useState(true);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setShowUserInto(false);
  };
  const toggle_friends_or_requests = () => {
    set_show_friends(!show_friends);
  };

  const startChat = async () => {
    console.log("%cSTART CHAT", "color: green");

    try {
      console.log("%cINSIDE TRY", "color: blue");

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
          `http://${ipAddress}:3003/user/block_user/${userIdCard}`,
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
    } else {
      try {
        const response = await fetch(
          `http://${ipAddress}:3003/user/unblock_user/${userIdCard}`,
          {
            method: "Get",
            headers: {
              Authorization: `Bearer ${JSCookies.get("accessToken")}`,
            },
          }
        );
        set_is_blocked(false);
      } catch (error) {
        alert("Could not modify friends list");
      }
    }
  };

  const updateFriendsList = async () => {
    if (isFriend) {
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
    } else {
      try {
        const response = await fetch(
          `http://${ipAddress}:3003/user/send_friend_request`,
          {
            method: "Post",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSCookies.get("accessToken")}`,
            },
            body: JSON.stringify({ adding_you: userIdCard }),
          }
        );
        // console.log(response);
        alert("Friend request has been sent");
      } catch (error) {
        alert("Could not modify friends list");
      }
    }
  };

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`http://${ipAddress}:3003/user/user_data`, {
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
      set_outgoing_friend_requests(data["outgoing_friend_req"]);
      set_incoming_friend_requests(data["incoming_friend_req"]);
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
          {!isMe && (
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
          )}
        </div>
        <UserStats userId={userIdCard} />
      </div>
      <button id="exit-buttton" onClick={toggleVisibility}>
        X
      </button>
      {userIdCard == userId ? (
        <>
          <div id="lists">
            {show_friends ? (
              <ListFriends
                friendsList={friendsList}
                setIsFriend={setIsFriend}
                setFriendsList={setFriendsList}
                toggle_friends_or_requests={toggle_friends_or_requests}
                show_friends={show_friends}
              />
            ) : (
              <Incoming_friend_requests
                incoming_friend_req={incoming_frined_requests}
                set_incoming_friend_requests={set_incoming_friend_requests}
                friendsList={friendsList}
                setFriendsList={setFriendsList}
                toggle_friends_or_requests={toggle_friends_or_requests}
                show_friends={show_friends}
              />
            )}
            <GameHistory gamesList={gamesList} />
          </div>
        </>
      ) : (
        <>
          <div id="lists">
            <ListFriends
              setFriendsList={setFriendsList}
              friendsList={friendsList}
              setIsFriend={setIsFriend}
              toggle_friends_or_requests={toggle_friends_or_requests}
              show_friends={show_friends}
            />
            <GameHistory gamesList={gamesList} />
          </div>
        </>
      )}
    </div>
  );
};

export default UserPage;
