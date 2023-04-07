import { useEffect, useState, useContext } from "react";
import JSCookies from "js-cookie";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";
import EverythingIsFine from "../../svg/everything-is-fine.svg";
import { json } from "node:stream/consumers";
import { useMyContext } from "../../contexts/InfoCardContext";
import { UserContext, useUserContext } from "../../contexts/UserContext";
import ipAddress from '../../constants';

interface NameProps {
  name: string;
  pic: string;
  other_user_id: string;
  incoming_friend_req: number[];
  set_incoming_friend_requests: React.Dispatch<React.SetStateAction<number[]>>;
  friendsList: number[];
  setFriendsList: React.Dispatch<React.SetStateAction<number[]>>;
}

const NameComponent = ({
  name,
  pic,
  other_user_id,
  incoming_friend_req,
  set_incoming_friend_requests,
  friendsList,
  setFriendsList,
}: NameProps) => {
  const accept_friend_request = async () => {
    console.log("allo cliecked button");
    try {
      const response = await fetch(
        `http://${ipAddress}:3003/user/accept_friend_request`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
          body: JSON.stringify({ accepting_you: other_user_id }),
        }
      );
      let new_incoming_friend_request: number[] = incoming_friend_req;
      const idx = new_incoming_friend_request.indexOf(Number(other_user_id));
      new_incoming_friend_request.splice(idx, 1);
      set_incoming_friend_requests([...new_incoming_friend_request]);
      let new_friendlist: number[] = friendsList;
      new_friendlist.push(Number(other_user_id));
      setFriendsList([...new_friendlist]);
    } catch (error) { }
  };

  const decline_friend_request = async () => {
    console.log("allo cliecked button");
    try {
      const response = await fetch(
        `http://${ipAddress}:3003/user/remove_friend_request`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
          body: JSON.stringify({ rejecting_you: other_user_id }),
        }
      );
      let new_incoming_friend_request: number[] = incoming_friend_req;
      const idx = new_incoming_friend_request.indexOf(Number(other_user_id));
      new_incoming_friend_request.splice(idx, 1);
      set_incoming_friend_requests([...new_incoming_friend_request]);
    } catch (error) { }
  };

  return (
    <li className="friend-card">
      <img
        src={pic}
        alt="userPhoto"
        style={{ width: "64px", height: "64px" }}
      />
      <button className="deep-purple-button" onClick={accept_friend_request}>
      &#10003;
      </button>
      <button className="deep-purple-button" onClick={decline_friend_request}>
      &#10005;
      </button>
      <span title={name}>{name}</span>
    </li>
  );
};

type Props = {
  incoming_friend_req: number[];
  set_incoming_friend_requests: React.Dispatch<React.SetStateAction<number[]>>;
  friendsList: number[];
  setFriendsList: React.Dispatch<React.SetStateAction<number[]>>;
  toggle_friends_or_requests: () => void;
  show_friends: boolean;
};

const Incoming_friend_requests = ({
  incoming_friend_req,
  set_incoming_friend_requests,
  friendsList,
  setFriendsList,
  show_friends,
  toggle_friends_or_requests
}: Props) => {
  const [friendsNames, setNames] = useState<string[]>([]);
  const [profilePictures, setProfilePictures] = useState<string[]>([]);
  const { picture_map, set_picture_map, pushPictureToMap } =
    useMyProfile_picture_Context();
  const { userIdCard } = useMyContext();
  const { myUserId } = useUserContext();
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const newlist = await Promise.all(
          incoming_friend_req.map(async (id) => {
            const response = await fetch(
              `http://${ipAddress}:3003/user/user_name`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${JSCookies.get("accessToken")}`,
                },
                body: JSON.stringify({ user_id: id }),
              }
            );
            const name = await response.text();
            return name;
          })
        );
        console.log("newlist " + JSON.stringify(newlist));
        console.log("newlist " + JSON.stringify(newlist));

        setNames(newlist);
      } catch (error) {
        console.error(`fetch Names in ListFriends failed: ${error}`);
      }
    };

    const getUserPic = async () => {
      try {
        const newlist = await Promise.all(
          incoming_friend_req.map(async (id) => {
            if (picture_map.has(Number(id))) {
              return picture_map.get(Number(id)) ?? "";
            }
            return pushPictureToMap(Number(id), picture_map, set_picture_map);
          })
        );
        setProfilePictures(newlist);
      } catch (error) {
        console.error(`fetch getUserPic in ListFriends failed: ${error}`);
      }
    };
    console.log("called this and refetching names and users pic ");

    fetchNames();
    getUserPic();
  }, [incoming_friend_req]);

  console.log("for all of these im trying " + JSON.stringify(friendsNames));
  console.log(
    "for all of these are all the ids " + JSON.stringify(incoming_friend_req)
  );

  return (
    <ul className="user-info-lists right-border">
      <div className="title-section">Incoming Friend Requests:</div>
      <br />
      {incoming_friend_req.length === 0 ? (
        <img className="everything-is-fine-svg" src={EverythingIsFine} alt="" />
      ) : (
        incoming_friend_req.map((other_id, idx) => (
          <NameComponent
            key={other_id}
            friendsList={friendsList}
            name={friendsNames[idx]}
            pic={profilePictures[idx]}
            other_user_id={incoming_friend_req[idx].toString()}
            incoming_friend_req={incoming_friend_req}
            set_incoming_friend_requests={set_incoming_friend_requests}
            setFriendsList={setFriendsList}
          />
        ))
      )}
      {myUserId == userIdCard ?
        <button className="purple-button" onClick={toggle_friends_or_requests}>
          {show_friends ? "Show Friend Requests" : "Show Your Friends"}
        </button>
        :
        <></>
      }
    </ul>
  );
};

export default Incoming_friend_requests;
