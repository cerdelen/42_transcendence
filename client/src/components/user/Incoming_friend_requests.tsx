import { useEffect, useState } from "react";
import JSCookies from "js-cookie";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";
import EverythingIsFine from "../../svg/everything-is-fine.svg"
const ipAddress = process.env.REACT_APP_Server_host_ip;

interface NameProps {
  name: string;
  pic: string;
  other_user_id: string;
}

const NameComponent = ({ name, pic, other_user_id}: NameProps) => {
	const accept_friend_request = async () => {
		console.log("allo cliecked button");
		try {
			const response = await fetch(`http://${ipAddress}:3003/user/accept_friend_request`, {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
          body: JSON.stringify({ accepting_you: other_user_id }),
        });
	  }
	  catch (error) {}
	}
	return (
    <li className="friend-card" onClick={accept_friend_request}>
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
	outgoing_friend_req: string[];
	incoming_friend_req: string[];
};


const Incoming_friend_requests = ({ outgoing_friend_req, incoming_friend_req}: Props) =>
{
  const [friendsNames, setNames] = useState<string[]>([]);
  const [profilePictures, setProfilePictures] = useState<string[]>([]);
  const { picture_map, set_picture_map, pushPictureToMap } =
    useMyProfile_picture_Context();
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

    fetchNames();
    getUserPic();
  }, [incoming_friend_req]);

  return (
      <ul className="user-info-lists right-border">
        <div className="title-section">Incoming Friend Requests:</div>
        <br />
        {friendsNames.length === 0 ? (
          <img className="everything-is-fine-svg" src={EverythingIsFine} alt="" />
          ) : (
            friendsNames.map((name, idx) => (
              <NameComponent key={name} name={name} pic={profilePictures[idx]} other_user_id={incoming_friend_req[idx]} />
              ))
            )}
            </ul>
  );
};

export default Incoming_friend_requests;
