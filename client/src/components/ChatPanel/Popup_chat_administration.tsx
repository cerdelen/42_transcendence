import { useEffect, useRef } from "react";
import JSCookies from "js-cookie";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import ipAddress from "../../constants";
import React from "react";

type administraion_props = {
  user_id: number;
  set_user_ids_in_chat_details: React.Dispatch<React.SetStateAction<number[]>>;
  is_muted: boolean;
  is_admin: boolean;
  participantCardRef: React.RefObject<HTMLDivElement>;
};

const Popup_chat_administration = (
  {
    user_id,
    set_user_ids_in_chat_details,
    is_muted,
    is_admin,
	participantCardRef
  }: administraion_props,
) => {
  const { displayed_chat } = useMyDisplayedChatContext();
  const handle_kick = async (user_id: number, is_banned_click: boolean) => {
    console.log(" called handle_kick or ban ");

    if (is_banned_click) {
      try {
        const respone = await fetch(
          `http://${ipAddress}:3003/conversation/${displayed_chat.conversation_id}/setBan/${user_id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${JSCookies.get("accessToken")}`,
            },
          }
        );
        const conv = await respone.json();
        const participants: number[] = conv["conversation_participant_arr"];
        if (!participants.includes(user_id)) {
          // kick was successfull
          const idx =
            displayed_chat.conversation_participant_arr.indexOf(user_id);
          displayed_chat.conversation_participant_arr.splice(idx, 1);
          displayed_chat.conversation_black_list_arr?.push(user_id);
          if (displayed_chat.conversation_mute_list_arr?.includes(user_id)) {
            const idx_m =
              displayed_chat.conversation_mute_list_arr.indexOf(user_id);
            displayed_chat.conversation_mute_list_arr.splice(idx_m, 1);
          }
          if (displayed_chat.conversation_admin_arr?.includes(user_id)) {
            const idx_a =
              displayed_chat.conversation_admin_arr.indexOf(user_id);
            displayed_chat.conversation_admin_arr.splice(idx_a, 1);
          }
          set_user_ids_in_chat_details([...participants]);
        }
      } catch (error) {}
    } else {
      try {
        const respone = await fetch(
          `http://${ipAddress}:3003/conversation/${displayed_chat.conversation_id}/setKick/${user_id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${JSCookies.get("accessToken")}`,
            },
          }
        );
        const conv = await respone.json();
        const participants: number[] = conv["conversation_participant_arr"];
        if (!participants.includes(user_id)) {
          // kick was successfull
          const idx =
            displayed_chat.conversation_participant_arr.indexOf(user_id);
          displayed_chat.conversation_participant_arr.splice(idx, 1);
          if (displayed_chat.conversation_mute_list_arr?.includes(user_id)) {
            const idx_m =
              displayed_chat.conversation_mute_list_arr.indexOf(user_id);
            displayed_chat.conversation_mute_list_arr.splice(idx_m, 1);
          }
          if (displayed_chat.conversation_admin_arr?.includes(user_id)) {
            const idx_a =
              displayed_chat.conversation_admin_arr.indexOf(user_id);
            displayed_chat.conversation_admin_arr.splice(idx_a, 1);
          }
          set_user_ids_in_chat_details([...participants]);
        }
      } catch (error) {}
    }
  };
  const handle_mute = async (user_id: number) => {
    try {
      const respone = await fetch(
        `http://${ipAddress}:3003/conversation/${displayed_chat.conversation_id}/setMute/${user_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        }
      );
      // const conv = await respone.json();
      // const admin_arr : number []= conv["conversation_mute_list_arr"];
      // if(admin_arr.includes(user_id))
      // {
      // 	displayed_chat.conversation_mute_list_arr?.push();
      // 	setmuted(true);
      // }
    } catch (error) {}
  };
  const handle_unmute = async (user_id: number) => {
    try {
      const respone = await fetch(
        `http://${ipAddress}:3003/conversation/${displayed_chat.conversation_id}/setUnMute/${user_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        }
      );
    } catch (error) {}
  };
  const handle_make_admin = async (user_id: number) => {
    try {
      const respone = await fetch(
        `http://${ipAddress}:3003/conversation/${displayed_chat.conversation_id}/setAdmin/${user_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        }
      );
    } catch (error) {}
  };
  
  return (
    <div id="admin-buttons">
      <button
        className="purple-button"
        onClick={() => handle_kick(user_id, false)}
      >
        KICK
      </button>
      {is_muted ? (
        <button
          className="purple-button"
          onClick={() => handle_unmute(user_id)}
        >
          UNMUTE
        </button>
      ) : (
        <button className="purple-button" onClick={() => handle_mute(user_id)}>
          MUTE
        </button>
      )}
      <button
        className="purple-button"
        onClick={() => handle_kick(user_id, true)}
      >
        BAN
      </button>
      {is_admin ? (
        <></>
      ) : (
        <button
          className="purple-button"
          onClick={() => handle_make_admin(user_id)}
        >
          MAKE ADMIN
        </button>
      )}
    </div>
  );
};

export default Popup_chat_administration;
