import React, { useState, useEffect, Fragment } from "react";
import { useUserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";
import group_picture from "../../images/group_chat_picture.jpeg";
import Chat_details from "./Chat_details";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import { json } from "react-router-dom";
import { our_socket } from "../../utils/context/SocketContext";
import { useMyChatCardsContext } from "../../contexts/chatCardsContext";
import SingleFieldInputForm from "../InputForms/SingleFieldInputForm";
import TwoFieldInputForm from "../InputForms/TwoFieldInputForm";
import ipAddress from '../../constants';

const Chat_name_input = ({ setButton_state }: { setButton_state: any }) => {
  const { my_chats_ids, setmy_chats_ids } = useMyChatCardsContext();
  const { setDisplayed_chat } = useMyDisplayedChatContext();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    inputValue: string,
    password?: string
  ) => {
    event.preventDefault();

    if (inputValue.length > 0) {
      console.log(`%cThis is the password: ${password}`, "color: blue");

      const response = await fetch(
        `http://${ipAddress}:3003/conversation/create_group_chat/create`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
          body: JSON.stringify({ chat_name: inputValue, password: password }),
        }
      );

      const data = await response.json();
      setDisplayed_chat(data);
      setButton_state(true);
      setmy_chats_ids([...my_chats_ids, data["conversation_id"]]);
    } else {
    }
  };

  return (
    <div>
      <TwoFieldInputForm
        handleSubmit={handleSubmit}
        buttonText="CREATE"
        fieldPlaceholder="name"
      ></TwoFieldInputForm>
    </div>
  );
};

// const handleCreateGroupChat = async (setButton_state: any) => {
//   setButton_state(false);
// };

const Group_chat_preview_card = ({
  chat_id,
  not_joined_chats_ids,
  my_chats_ids,
  setmy_chats_ids,
  setNot_joined_chats_ids,
}: {
  chat_id: number;
  not_joined_chats_ids: number[];
  my_chats_ids: number[];
  setmy_chats_ids: any;
  setNot_joined_chats_ids: any;
}) => {
  const [conversation_name, setConversation_name] = useState("");
  const [hasPassword, setHasPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, inputValue: string) => {
    event.preventDefault();
    console.log(`%cHANDLE SUBMIT`, 'color: blue');

    const response = await fetch(
      `http://${ipAddress}:3003/conversation/join_group_chat/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: JSON.stringify({ chat_id: chat_id, password: inputValue }),
      }
    );
    const data = await response.json();
    console.log(`Allowed to join: ${data}`);

    if (data == true) {
      setmy_chats_ids([...my_chats_ids, chat_id]);
      let arr_2: number[] = [];
      for (let i = 0; i < not_joined_chats_ids.length; i++) {
        if (chat_id != not_joined_chats_ids[i])
          arr_2.push(not_joined_chats_ids[i]);
      }
      setNot_joined_chats_ids(arr_2);
    } else {

      alert("Wrong password or banned from chat");
    }
  };

  const joinChat = async () => {
    console.log(`JOIN CHAT`);

    const response = await fetch(
      `http://${ipAddress}:3003/conversation/join_group_chat/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: JSON.stringify({ chat_id: chat_id, password: "" }),
      }
    );
    const data = await response.json();
    console.log(`Status: ${data}`);

    if (data == true) {
      setmy_chats_ids([...my_chats_ids, chat_id]);
      let arr_2: number[] = [];
      for (let i = 0; i < not_joined_chats_ids.length; i++) {
        if (chat_id != not_joined_chats_ids[i])
          arr_2.push(not_joined_chats_ids[i]);
      }
      setNot_joined_chats_ids(arr_2);
    } else {
      alert("Banned from chat");
    }
  };

  const checkIfPasswordProtected = async () => {
    try {
      const response = await fetch(
        `http://${ipAddress}:3003/conversation/is_password_protected/${chat_id}`,
        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        }
      );
      const passwordStatus = await response.json();
      console.log("Status");
      console.log(passwordStatus);

      setHasPassword(passwordStatus);
      return passwordStatus;
    } catch (error) {
      //NEED TO SEE ABOUT THIS

      return true;
    }
  };

  const handleOnClick = async () => {
    const passwordIsSet = await checkIfPasswordProtected();
    console.log(`Password is set: ${passwordIsSet}`);

    if (passwordIsSet) return;
    await joinChat();
  };

  const get_conversation = async (conversation_id: number) => {
    const response = await fetch(
      `http://${ipAddress}:3003/conversation/getConversationNameById/${conversation_id}`,
      {
        method: "Get",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      }
    );
    const data = await response.text();
    setConversation_name(data);
  };

  useEffect(() => {
    get_conversation(chat_id);
  }, []);
  return (
    <li className="Chat_preview_cards">
      {hasPassword ? (
        <SingleFieldInputForm
          handleSubmit={handleSubmit}
          fieldPlaceholder="Password needed"
          buttonText="Submit"
        />
      ) : (
        <Fragment>
          <img src={group_picture} alt="" />
          <div className="name-and-button">
            <span id="user-name" title={"chat_name"}>
              {conversation_name}
            </span>
            <button className="deep-purple-button" onClick={handleOnClick}>JOIN</button>
          </div>
        </Fragment>
      )}
    </li>
  );
};

const Get_all_open_group_chats = ({
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
  const { myUserId } = useUserContext();
  useEffect(() => {
    async function get_ids() {
      const response = await fetch(
        `http://${ipAddress}:3003/conversation/getAllChatsWithoutUser`,
        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        const data: number[] = await response.json();
        setNot_joined_chats_ids(data);
      }
    }
    get_ids();
  }, []);

  useEffect(() => {
    if (myUserId !== '') {

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
          if (left_user_id == Number(myUserId) && conv_still_exists) {
            if (!not_joined_chats_ids.includes(conv_id))
              setNot_joined_chats_ids([...not_joined_chats_ids, conv_id]);
          } else if (left_user_id !== Number(myUserId) && !conv_still_exists) {
            console.log("else if");
            const updatedChats = not_joined_chats_ids;
            const idx = updatedChats.indexOf(conv_id);
            if (idx != -1) {
              console.log("else if -1");
              console.log(updatedChats);
              updatedChats.splice(idx, 1);
              console.log(updatedChats);
              setNot_joined_chats_ids([...updatedChats]);
            }
          }
        }
      );
    }

  }, [myUserId, not_joined_chats_ids])

  useEffect(() => {
    if (myUserId !== '') {

      our_socket.on("created_group_chat", ({ chat_id, creator_id }: { chat_id: number, creator_id: number }) => {
        if (Number(myUserId) !== creator_id) {
          console.log("Created group chat", chat_id, creator_id);
          if (!not_joined_chats_ids.includes(chat_id))
            setNot_joined_chats_ids([...not_joined_chats_ids, chat_id]);
        }
      })
    }

  }, [myUserId, not_joined_chats_ids])

  return (
    <ul className="list-cards right-shadow">
      {not_joined_chats_ids.map((chat_id) => (
        <Group_chat_preview_card
          key={chat_id}
          chat_id={chat_id}
          not_joined_chats_ids={not_joined_chats_ids}
          my_chats_ids={my_chats_ids}
          setmy_chats_ids={setmy_chats_ids}
          setNot_joined_chats_ids={setNot_joined_chats_ids}
        />
      ))}
    </ul>
  );
};

const Open_group_cards = () => {
  // console.log("rendering Open_group_cards");
  const {
    my_chats_ids,
    setmy_chats_ids,
    not_joined_chats_ids,
    setNot_joined_chats_ids,
  } = useMyChatCardsContext();
  const [button_state, setButton_state] = useState(true);
  return (
    <div className="community-side-collumn">
      <div className="right-pane-column">
        <h2>JOIN GROUP CHATS</h2>

        <Get_all_open_group_chats
          not_joined_chats_ids={not_joined_chats_ids}
          my_chats_ids={my_chats_ids}
          setmy_chats_ids={setmy_chats_ids}
          setNot_joined_chats_ids={setNot_joined_chats_ids}
        />

        {button_state ? (
          <button
            className="purple-button"
            onClick={() => setButton_state(false)}
          >
            CREATE GROUP CHAT
          </button>
        ) : (
          <Chat_name_input setButton_state={setButton_state} />
        )}
      </div>

      <div className="right-pane-column">
        <h2>CHAT DETAILS</h2>
        <Chat_details/>
      </div>
    </div>
  );
};

export default Open_group_cards;