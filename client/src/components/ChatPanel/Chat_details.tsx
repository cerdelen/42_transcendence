import { useContext, useEffect, useState } from "react";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import { UserContext } from "../../contexts/UserContext";
import { our_socket } from "../../utils/context/SocketContext";
import JSCookies from "js-cookie";
import { displayed_chat_class } from "../../utils/types";
import Popup_chat_administration from "./Popup_chat_administration";
import { FaCrown } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { RiVolumeMuteFill } from "react-icons/ri";
import themeAchievement from "../../images/changed-theme-achievement.png";
import path from "path";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";
const ipAddress = process.env.REACT_APP_Server_host_ip;

import InputFieldOrButton from "../InputForms/InputFIeldOrButton";

const handleLeaveChat = (
  chat_id: number,
  userId: string,
  group_chat: boolean | undefined
) => {
  console.log("%ccalling this handleLeaveChat", "color: pink");

  if (group_chat == false) return;
  if (chat_id != -1) {
    our_socket.emit("leave_group_chat", { chat_id: chat_id, userId: userId });
  }
};




const Participant_in_chat_detail_card = ({
  user_id,
  set_user_ids_in_chat_details,
}: {
  user_id: number;
  set_user_ids_in_chat_details: any;
}) => {
  const { displayed_chat } = useMyDisplayedChatContext();
  const [is_owner, set_is_owner] = useState(false);
  const [is_admin, set_is_admin] = useState(false);
  const [is_muted, set_is_muted] = useState(false);
  const [display_popup, set_display_popup] = useState(false);
  const [user_name, set_user_name] = useState("");
  const { userId } = useContext(UserContext);
  const is_me = Number(userId) == user_id;
  const [photo, setPhoto] = useState("");
  const { picture_map, set_picture_map, pushPictureToMap } =
    useMyProfile_picture_Context();
  useEffect(() => {
    async function get_name() {
      try {
        const response = await fetch(`http://${ipAddress}:3003/user/user_name`, {
          method: "POST",
          body: JSON.stringify({ user_id: user_id.toString() }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        });

        const user_name_inside = await response.text();
        set_user_name(user_name_inside);
      } catch (error) {
        console.error(error);
      }
    }
    get_name();
  }, []);

  useEffect(() => {
    const getUserPic = async () => {
      try {
        if (picture_map.has(Number(user_id))) {
          setPhoto(picture_map.get(Number(user_id)) ?? "");
          return;
        }
        return pushPictureToMap(Number(user_id), picture_map, set_picture_map);
      } catch (error) {
        console.error(`fetch getUserPic in ListFriends failed: ${error}`);
      }
    };
    getUserPic();
  }, []);

  if (
    displayed_chat.conversation_owner_arr?.includes(user_id) &&
    is_owner == false
  ) {
    set_is_owner(true);
  } else if (
    !displayed_chat.conversation_owner_arr?.includes(user_id) &&
    is_owner == true
  ) {
    set_is_owner(false);
  }
  if (
    displayed_chat.conversation_admin_arr?.includes(user_id) &&
    is_admin == false
  ) {
    set_is_admin(true);
  } else if (
    !displayed_chat.conversation_admin_arr?.includes(user_id) &&
    is_admin == true
  ) {
    set_is_admin(false);
  }
  if (
    displayed_chat.conversation_mute_list_arr?.includes(user_id) &&
    is_muted == false
  ) {
    set_is_muted(true);
  } else if (
    !displayed_chat.conversation_mute_list_arr?.includes(user_id) &&
    is_muted == true
  ) {
    set_is_muted(false);
  }

  const open_admin_as = () => {
    if (Number(userId) != user_id && displayed_chat.group_chat == true)
      set_display_popup(!display_popup);
  };

  return (
    <div className="participant-card" onClick={() => open_admin_as()}>
      <img src={photo} alt="" />
      {is_me ? <span> You </span> : <span> {user_name} </span>}
      <div className="icons">
        {is_owner && <FaCrown title="owner" />}
        {is_admin && <RiAdminLine title="admin" />}
        {is_muted && <RiVolumeMuteFill title="muted" />}
        {display_popup && (
          <Popup_chat_administration
            user_id={user_id}
            setmuted={set_is_muted}
            setadmin={set_is_admin}
            setowner={set_is_owner}
            set_user_ids_in_chat_details={set_user_ids_in_chat_details}
          />
        )}
      </div>
    </div>
  );
};

const Chat_details = ({
  not_joined_chats_ids,
  my_chats_ids,
  setmy_chats_ids,
  setNot_joined_chats_ids,
}: {
  not_joined_chats_ids: number[];
  my_chats_ids: number[];
  setmy_chats_ids: any;
  setNot_joined_chats_ids: any;
}) => {
  const { displayed_chat, setDisplayed_chat } = useMyDisplayedChatContext();
  const { userId } = useContext(UserContext);
  const [user_ids_in_chat_details, set_user_ids_in_chat_details] = useState<
    number[]
  >([...displayed_chat.conversation_participant_arr]);

  useEffect(() => {
    async function set_map() {
      set_user_ids_in_chat_details([
        ...displayed_chat.conversation_participant_arr,
      ]);
    }
    set_map();
  }, [displayed_chat]);

  our_socket.on(
    "some_one_joined_group_chat",
    ({
      conv_id,
      joined_user_id,
    }: {
      conv_id: number;
      joined_user_id: number;
    }) => {
      if (
        joined_user_id != Number(userId) &&
        conv_id == displayed_chat.conversation_id
      ) {
        set_user_ids_in_chat_details([
          ...user_ids_in_chat_details,
          joined_user_id,
        ]);
      }
    }
  );

  const handleSetPassword = async (
    event: React.FormEvent<HTMLFormElement>,
    inputValue: string
  ) => {
    if (inputValue.length > 0) {
      console.log(displayed_chat.conversation_id + "chat id i append to url");
      try {
        
        await fetch(
          `http://${ipAddress}:3003/conversation/change_password/${displayed_chat.conversation_id }`,
          {
            method: "Post",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSCookies.get("accessToken")}`,
            },
            // body: JSON.stringify({"Password": inputValue}),
            body: JSON.stringify({ password: inputValue }),
          }
        );
        alert("You successfully set a password")
      } catch (error) {
        alert("The password could not be set")
      }

    }
  };

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>,
    inputValue: string
  ) => {
    if (inputValue.length > 0) {
      console.log(displayed_chat.conversation_id + "chat id i append to url");
      try {
        
        await fetch(
          `http://${ipAddress}:3003/conversation/change_password/${displayed_chat.conversation_id }`,
          {
            method: "Post",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSCookies.get("accessToken")}`,
            },
            // body: JSON.stringify({"Password": inputValue}),
            body: JSON.stringify({ Password: inputValue }),
          }
        );
        alert("You successfully set a password")
      } catch (error) {
        alert("The password could not be set")
      }

    }
  };

  const handleRemovePassword = async (chat_id: number) => {
    try {
      await fetch(
        `http://${ipAddress}:3003/conversation/remove_password/${chat_id}`,
        {
          method: "Get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        }
      );
      alert("Passwort successfully removed")
    } catch (error) {
      console.error(error);
      alert("Could not remove password")
    }
  }

  our_socket.on(
    "some_one_left_group_chat",
    ({
      conv_id,
      left_user_id,
      conv_still_exists,
    }: {
      conv_id: number;
      left_user_id: number;
      conv_still_exists: boolean;
    }) => {
      if (
        left_user_id != Number(userId) &&
        conv_id == displayed_chat.conversation_id &&
        conv_still_exists
      ) {
        const left_user_idx = user_ids_in_chat_details.indexOf(left_user_id);
        if (left_user_idx !== -1) {
          user_ids_in_chat_details.splice(left_user_idx, 1);
          set_user_ids_in_chat_details([...user_ids_in_chat_details]);
        }
      }
    }
  );

  return (
    <div className="Chat_details">
      {displayed_chat.conversation_name && (
        <div className="Chat_name_for_chat_details">
          {displayed_chat.conversation_name}
        </div>
      )}
      <ul className="User_list_in_chat_detals">
        {user_ids_in_chat_details.map((user_id) => (
          <Participant_in_chat_detail_card
            user_id={user_id}
            key={user_id}
            set_user_ids_in_chat_details={set_user_ids_in_chat_details}
          />
        ))}
      </ul>
      <div className="admin-buttons">
        {displayed_chat.group_chat && (
          <button
            className="purple-button"
            onClick={() =>
              handleLeaveChat(
                displayed_chat.conversation_id,
                userId,
                displayed_chat.group_chat
              )
            }
          >
            Leave Chat
          </button>
        )}
        {displayed_chat.group_chat &&
          displayed_chat.conversation_owner_arr?.includes(Number(userId)) && (
			<div className="password-buttons">
				<InputFieldOrButton buttonText="Set Password" fieldPlaceholder="Password" handleSubmit={handleSetPassword}/>
				{/* <InputFieldOrButton buttonText="Reset Password" fieldPlaceholder="Password" handleSubmit={handleResetPassword}/> */}
				<button className="purple-button" onClick={() => {handleRemovePassword(displayed_chat.conversation_id)}}> Remove Password</button>
			</div>
          )}
      </div>
    </div>
  );
};

export default Chat_details;
