import React, { useContext, useEffect, useState } from "react";
import JSCookies from "js-cookie";
import { useUserContext } from "../../contexts/UserContext";
import { AiOutlineEdit } from "react-icons/ai";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import ListFriends from "./ListFriends";
import UserName from "./UserName";
import UserPhoto from "./UserPhoto";
import { useMyContext } from "../../contexts/InfoCardContext";
import GameHistory from "./GamesHistory";
import UserStats from "./UserStatistics";
import { our_socket } from "../../utils/context/SocketContext";
import { Link, useNavigate, useRouteError } from "react-router-dom";
import { CounterContext } from "../../utils/context/CounterContext";
import Incoming_friend_requests from "./Incoming_friend_requests";
import ipAddress from '../../constants';

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
  const { myUserId, myMail, mytwoFAenabled, gameInvited, setGameInvited ,myBlockedUsers, myGames,
    myOutgoingFriendReq, myIncomingFriendReq, gameActive,
    myFriendList, setMyFriendList, myName,
    setMyIncomingFriendReq, setMyOutgoingFriendReq }
    = useUserContext();
    const navigate = useNavigate();
  const { userIdCard, setShowUserInto } = useMyContext();
  const [isVisible, setIsVisible] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [TFA, setTFA] = useState(false);
  const [friendsListIdCard, setFriendsListIdCard] = useState<number[]>([]);
  const [out_going_friend_requests, set_outgoing_friend_requests] = useState<
    number[]
  >([]);
  const [incoming_frined_requests, set_incoming_friend_requests] = useState<
    number[]
  >([]);
  const [gamesList, setGamesList] = useState<number[]>([]);
  const isMe = myUserId === userIdCard;
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
        userid_creator: myUserId,
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
        // alert("Friend request has been sent");
      } catch (error) {
        alert("Could not modify friends list");
      }
    }
  };
  const remove_friend_request = async () => {
    try {
      const response = await fetch(
        `http://${ipAddress}:3003/user/remove_friend_request`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
          body: JSON.stringify({ rejecting_you: userIdCard }),
        }
      );
    } catch (error) {
      alert("Could not reject friends request");
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
      setFriendsListIdCard(data["friendlist"]);
      // set_outgoing_friend_requests(data["outgoing_friend_req"]);
      set_incoming_friend_requests(data["incoming_friend_req"]);
      setGamesList(data["games"]);
      setIsFriend(data["friendlist"].includes(Number(myUserId)));
      set_is_blocked(myBlockedUsers.includes(Number(userIdCard)));
    };
    if (userIdCard) { getData() }
  }, [userIdCard]);

  useEffect(() => {
    const setup_sockets = () =>
    {
      console.log("setup sockets for new friend accept");
      our_socket.on('new_friend_accepted', ({ friend_id_1, friend_id_2 }: { friend_id_1: number, friend_id_2: number }) => {
        console.log("new_friend_accepted ");
        if (friend_id_1 === Number(myUserId) && friend_id_2 === Number(userIdCard)) {
          if (!friendsListIdCard.includes(friend_id_1)) {
            setFriendsListIdCard([...friendsListIdCard, friend_id_1]);
            if (myOutgoingFriendReq.includes(friend_id_2)) {
              const idx = myOutgoingFriendReq.indexOf(friend_id_2)
              if (idx != -1) {
                myOutgoingFriendReq.splice(idx, 1)
                setMyOutgoingFriendReq([...myOutgoingFriendReq]);
              }
            }
            if (myIncomingFriendReq.includes(friend_id_2)) {
              const idx = myIncomingFriendReq.indexOf(friend_id_2)
              if (idx != -1) {
                myIncomingFriendReq.splice(idx, 1)
                setMyIncomingFriendReq([...myIncomingFriendReq]);
              }
            }
          }
          if (!myFriendList.includes(friend_id_2)) {
            console.log("setting new friendlist, adding this id " + friend_id_2);
            setMyFriendList([...myFriendList, friend_id_2])
          }
          setIsFriend(true);
        } else if (friend_id_1 === Number(userIdCard) && friend_id_2 === Number(myUserId)) {
          if (!friendsListIdCard.includes(friend_id_2)) {
            setFriendsListIdCard([...friendsListIdCard, friend_id_2]);
          }
          if (!myFriendList.includes(friend_id_1)) {
            console.log("setting new friendlist, adding this id " + friend_id_1);
            setMyFriendList([...myFriendList, friend_id_1])
          }
          if (myOutgoingFriendReq.includes(friend_id_1)) {
            const idx = myOutgoingFriendReq.indexOf(friend_id_1)
            if (idx != -1) {
              myOutgoingFriendReq.splice(idx, 1)
              setMyOutgoingFriendReq([...myOutgoingFriendReq]);
            }
          }
          if (myIncomingFriendReq.includes(friend_id_1)) {
            const idx = myIncomingFriendReq.indexOf(friend_id_1)
            if (idx != -1) {
              myIncomingFriendReq.splice(idx, 1)
              setMyIncomingFriendReq([...myIncomingFriendReq]);
            }
          }
          setIsFriend(true);
        }
      })
    }
    if (myFriendList != undefined)
      setup_sockets();
  }, [myUserId, userIdCard, myFriendList]);

  useEffect(() => {
    const setup_sockets = () =>
    {
      our_socket.on('new_friend_request_received', ({ received_friend_req, sent_friend_req }: { received_friend_req: number, sent_friend_req: number }) => {
        console.log("inside friend request received " + received_friend_req, sent_friend_req, Number(myUserId), Number(userIdCard));
        if (Number(myUserId) == received_friend_req && Number(userIdCard) == received_friend_req) {
          if (!incoming_frined_requests.includes(sent_friend_req)) {
            incoming_frined_requests.push(sent_friend_req);
            set_incoming_friend_requests([...incoming_frined_requests]);
          }
        }
        if (Number(myUserId) == sent_friend_req && received_friend_req == Number(userIdCard)) {
          console.log("got into if second");
          if (!myOutgoingFriendReq.includes(received_friend_req)) {
            myOutgoingFriendReq.push(received_friend_req);
            setMyOutgoingFriendReq([...myOutgoingFriendReq])
          }
        }
      })
    }
    if (incoming_frined_requests != undefined)
      setup_sockets();
  }, [myUserId, incoming_frined_requests]);

  useEffect(() => {
    const setup_sockets = () =>
    {

      our_socket.on('delete_friend_request', ({ user_one, user_two }: { user_one: number, user_two: number }) => {
        console.log("delete friend request socket");
        
        if (Number(myUserId) == user_one && Number(userIdCard) == user_one) {
          const idx = incoming_frined_requests.indexOf(user_two);
          if (idx != -1) {
            incoming_frined_requests.splice(idx, 1);
            set_incoming_friend_requests([...incoming_frined_requests]);
          }
        }
        else if (Number(myUserId) == user_two && Number(userIdCard) == user_two) {
          const idx = incoming_frined_requests.indexOf(user_one);
          if (idx != -1) {
            incoming_frined_requests.splice(idx, 1);
            set_incoming_friend_requests([...incoming_frined_requests]);
          }
        }
      })
    }
    if (incoming_frined_requests != undefined)
      setup_sockets();
  }, [myUserId, incoming_frined_requests]);

  useEffect(() => {
    const setup_sockets = () =>
    {

      our_socket.on('remove_friend', ({ user_one, user_two }: { user_one: number, user_two: number }) => {
        // console.log("socket on remove friend");
        if (Number(myUserId) == user_one || Number(myUserId) == user_two)
        setIsFriend(false)
        if (friendsListIdCard.includes(user_one)) {
          const idx = friendsListIdCard.indexOf(user_one)
          friendsListIdCard.splice(idx, 1);
          setFriendsListIdCard([...friendsListIdCard])
        }
        if (friendsListIdCard.includes(user_two)) {
          const idx = friendsListIdCard.indexOf(user_two)
          friendsListIdCard.splice(idx, 1);
          setFriendsListIdCard([...friendsListIdCard])
        }
      })
    }
    if (friendsListIdCard != undefined)
      setup_sockets();

  }, [myUserId, friendsListIdCard]);


  function startAndinvitePlayers(userId: string, userName: string) {
    if(gameActive)
    {
      alert("You have game ongoing cannot invite other players");
      navigate('/game')
      return ;
    }
    console.log(userId + " Inviting player " + userName);
    navigate('/game')
    setShowUserInto(false);
    setGameInvited(true);
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
          <span id="player-name">{`Player: ${userName}`}</span>
          <span>{`Email: ${userEmail}`}</span>
          {isMe ? <span>{`2FA enabled: ${TFA}`}</span> : <span></span>}
          {!isMe && (
            <div id="buttons">
              <button className="purple-button" onClick={startChat}>
                Chat
              </button>
              {/* <Link to="/game"> */}
                <button
                  className="purple-button"
                  onClick={() => startAndinvitePlayers(myUserId, userName)}
                >
                  Play
                </button>
              {/* </Link> */}
              {
                isFriend ?
                  <button className="purple-button" onClick={updateFriendsList}>
                    UNFRIEND
                  </button>
                  :
                  myOutgoingFriendReq.includes(Number(userIdCard)) ?
                    <button className="purple-button" onClick={remove_friend_request}>
                      REMOVE FRIEND REQUEST
                    </button>
                    :
                    <button className="purple-button" onClick={updateFriendsList}>
                      SEND FRIEND REQUEST
                    </button>
              }
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
      {userIdCard == myUserId ? (
        <>
          <div id="lists">
            {show_friends ? (
              <ListFriends
                friendsList={friendsListIdCard}
                setIsFriend={setIsFriend}
                setFriendsList={setFriendsListIdCard}
                toggle_friends_or_requests={toggle_friends_or_requests}
                show_friends={show_friends}
              />
            ) : (
              <Incoming_friend_requests
                incoming_friend_req={incoming_frined_requests}
                set_incoming_friend_requests={set_incoming_friend_requests}
                friendsList={friendsListIdCard}
                setFriendsList={setFriendsListIdCard}
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
              setFriendsList={setFriendsListIdCard}
              friendsList={friendsListIdCard}
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
