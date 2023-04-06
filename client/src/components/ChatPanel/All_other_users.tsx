import { useState, useEffect, useContext } from "react";
import JSCookies from "js-cookie";
import { useMyContext } from "../../contexts/InfoCardContext";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";
import { Online_users_context } from "../../contexts/Online_users_context";
const ipAddress = process.env.REACT_APP_Server_host_ip;

const User_preview_card = ({
  other_user_id,
  online,
}: {
  other_user_id: number;
  online: boolean;
}) => {
  const { setUserIdCard, setShowUserInto } = useMyContext();

  const handleOnClick = () => {
    setUserIdCard(other_user_id.toString());
    setShowUserInto(true);
  };

  const [photo, setPhoto] = useState("");
  const [user_name, set_user_name] = useState("");
  const { picture_map, set_picture_map, pushPictureToMap} =
    useMyProfile_picture_Context();
  const { online_users } = useContext(Online_users_context);

  useEffect(() => {
    const get_user_info = async (other_user_id: number) => {
      const response = await fetch(`http://${ipAddress}:3003/user/user_name`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: JSON.stringify({ user_id: other_user_id }),
      });
      const data = await response.text();
      set_user_name(data);
      if (picture_map.has(Number(other_user_id)))
        setPhoto(picture_map.get(Number(other_user_id)) ?? "");
      else
        setPhoto(
          await pushPictureToMap(
            Number(other_user_id),
            picture_map,
            set_picture_map
          )
        );
    };
    get_user_info(other_user_id);
  }, [online_users]);

  return (
    <li
      className="Chat_preview_cards online-status"
      title={user_name}
      onClick={handleOnClick}
    >
      <img src={photo} alt="" />
      <span id="user-name">{user_name}</span>
      <span
        id="status-dot-other-players"
        style={{ backgroundColor: online ? "purple" : "gray" }} //hardcoded
      ></span>
    </li>
  );
};

const Get_all_other_users = () => {
  const [other_users_ids, set_other_users_id] = useState<number[]>([]);
  const { online_users } = useContext(Online_users_context);

  useEffect(() => {
    async function get_all_user_ids() {
      const response = await fetch(
        `http://${ipAddress}:3003/user/get_all_other_user_ids`,
        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        const data: number[] = await response.json();

        console.log("DATA");

        console.log(typeof data[0]);
        console.log(data);

        set_other_users_id(data);
      }
    }
    get_all_user_ids();
  }, []);

  return (
    <div className="left-pane-column">
      <h2>All Players</h2>
      <ul className="list-cards">
        {other_users_ids.map((other_user_id) => (
          <User_preview_card
            key={other_user_id}
            other_user_id={other_user_id}
            online={online_users.includes(other_user_id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Get_all_other_users;
