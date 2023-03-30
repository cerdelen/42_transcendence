import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";
import group_picture from "../../images/group_chat_picture.jpeg";
import Chat_details from "./Chat_details";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import { json } from "react-router-dom";
import { our_socket } from "../../utils/context/SocketContext";
import { useMyChatCardsContext } from "../../contexts/chatCardsContext";

const Chat_name_input = ({ setButton_state }: { setButton_state: any; }) => {

  const { my_chats_ids, setmy_chats_ids, not_joined_chats_ids, setNot_joined_chats_ids } = useMyChatCardsContext();
  const [inputValue, setInputValue] = useState("");
  const { setDisplayed_chat } = useMyDisplayedChatContext();

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = async () => {
    if (inputValue.length > 0) {
      const response = await fetch(
        `http://localhost:3003/conversation/create_group_chat/${inputValue}`,
        {
          method: "Get",
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
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
    <div className="popup">
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleButtonClick}>CREATE</button>
    </div>
  );
};

const handleCreateGroupChat = async (setButton_state: any) => {
  setButton_state(false);
};

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

  const handleOnClick = async () => {
    // console.log("handleOnClick of group chat card for chat id " + chat_id);
    const response = await fetch(
      `http://localhost:3003/conversation/join_group_chat/${chat_id}`,
      {
        method: "Get",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      }
    );
    const data = await response.json();
    // console.log("after fetch" + JSON.stringify(data));
    if (data == true) {
      // console.log("got inot the data == true ");

      // let arr: number[] = [];
      // for (let i = 0; i < my_chats_ids.length; i++) {
      //   arr.push(my_chats_ids[i]);
      // }
      // arr.push(chat_id);
      setmy_chats_ids([...my_chats_ids, chat_id]);
      let arr_2: number[] = [];
      for (let i = 0; i < not_joined_chats_ids.length; i++) {
        if (chat_id != not_joined_chats_ids[i])
          arr_2.push(not_joined_chats_ids[i]);
      }
      setNot_joined_chats_ids(arr_2);
    }
  };

  useEffect(() => {
    const get_conversation = async (conversation_id: number) => {
      const response = await fetch(
        `http://localhost:3003/conversation/getConversationById/${conversation_id}`,
        {
          method: "Get",
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      const participants = data["conversation_participant_arr"];
      setConversation_name(data["conversation_name"]);
    };
    get_conversation(chat_id);
  }, []);
  return (
    <li className="Chat_preview_cards" onClick={handleOnClick}>
      {/* <div> */}
        <img src={group_picture} alt="" />
        <span id="user-name" title={"chat_name"}>
          {conversation_name}
        </span>
      {/* </div> */}
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
  const { userId } = useContext(UserContext);
  useEffect(() => {
    async function get_ids() {
      const response = await fetch(
        "http://localhost:3003/conversation/getAllChatsWithoutUser",
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

  our_socket.on("some_one_left_group_chat", ({ conv_id, left_user_id, conv_still_exists }: { conv_id: number, left_user_id: number, conv_still_exists: boolean }) => {
    // console.log("this is the on subscriber");
    if (left_user_id == Number(userId) && conv_still_exists) {
      if (!not_joined_chats_ids.includes(conv_id))
        setNot_joined_chats_ids([...not_joined_chats_ids, conv_id]);
    }
  });
  // console.log(not_joined_chats_ids);

  return (
    <ul className="list-cards right-shadow">
      {not_joined_chats_ids.map((chat_id, idx) => (
        <Group_chat_preview_card
          key={idx}
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
  const { my_chats_ids, setmy_chats_ids, not_joined_chats_ids, setNot_joined_chats_ids } = useMyChatCardsContext();
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
          <button className="purple-button" onClick={() => setButton_state(false)}>
            CEATE GROUP CHAT
          </button>
        ) : (
          <Chat_name_input
            setButton_state={setButton_state}
          />
        )}
      </div>

      <div className="right-pane-column">
        <h2>CHAT DETAILS</h2>
        <Chat_details
          not_joined_chats_ids={not_joined_chats_ids}
          my_chats_ids={my_chats_ids}
          setmy_chats_ids={setmy_chats_ids}
          setNot_joined_chats_ids={setNot_joined_chats_ids}
        />
      </div>
    </div>
  );
};

export default Open_group_cards;
