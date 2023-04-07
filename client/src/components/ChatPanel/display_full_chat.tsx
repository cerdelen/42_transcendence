import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useUserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";
import { our_socket } from "../../utils/context/SocketContext";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";
import ipAddress from '../../constants';

interface typing {
  name: string;
  isTyping: boolean;
  chat_id: number;
}

interface message {
  author_id: string;
  text: string;
  chat_id: number;
}

class display_message_info {
  text: string;
  author_id: number;

  constructor(_text: string, _author_id: number) {
    this.text = _text;
    this.author_id = _author_id;
  }
}

function DisplayTyping({ typingDisplay }: { typingDisplay: string }) {
  return <>{typingDisplay}</>;
}

const Display_message_in_chat = ({
  message,
}: {
  message: display_message_info;
}) => {
  const { myUserId } = useUserContext();
  const is_me: boolean = message.author_id == Number(myUserId);
  const { name_map, set_name_map, pushNameToMap } =
    useMyProfile_picture_Context();

  if (!name_map.has(message.author_id))
    pushNameToMap(message.author_id, name_map, set_name_map);

  return (
    <>
      <div className={`${is_me ? "right-message" : "left-message"} chat-entry`}>
        <div id="message-author">{name_map.get(message.author_id)}</div>
        <div>{message.text}</div>
      </div>
    </>
  );
};

function Display_full_chat({ chat_id }: { chat_id: number }) {
  const [typingDisplay, setTypingDisplay] = useState("");
  const [messages, set_messages] = useState<Array<display_message_info>>([]);
  const chatWindow = useRef<HTMLDivElement>(null);
  const [name_map, set_name_map] = useState<Map<number, string>>(new Map());
  const { displayed_chat } = useMyDisplayedChatContext();
  const { myUserId, myBlockedUsers } = useUserContext();

  our_socket.on("message", (message: message) => {
    if (message.chat_id == displayed_chat.conversation_id && !myBlockedUsers.includes(Number(message.author_id))) {
      let newMessage: display_message_info[] = [];
      for (let i = 0; i < messages.length; i++) {
        newMessage.push(messages[i]);
      }
      newMessage.push(
        new display_message_info(message.text, Number(message.author_id))
      );
      set_messages(newMessage);
    }
  });
  our_socket.on("typing", (typing: typing) => {
    if (typing.isTyping && typing.chat_id == displayed_chat.conversation_id && typing.name != myUserId && !myBlockedUsers.includes(Number(typing.name))) {
      const name = name_map.get(Number(typing.name));
      setTypingDisplay(`${name} is typing ...`);
    } else {
      setTypingDisplay("");
    }
  });
  useEffect(() => {
    const prep_name_map = async (participants: number[]) => {
      let temp_map: Map<number, string> = new Map();
      for (let index = 0; index < participants.length; index++) {
        const response = await fetch(
          `http://${ipAddress}:3003/user/user_name`,
          {
            method: "Post",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${JSCookies.get("accessToken")}`,
            },
            body: JSON.stringify({ user_id: participants[index] }),
          }
        );
        const userName = await response.text();

        temp_map.set(participants[index], userName);
      }
      console.log("setting name map");

      set_name_map(temp_map);
    };
    const get_messages = async (chat_id: number) => {
      if (chat_id == -1) {
        const empty: display_message_info[] = [];
        set_messages(empty);
        return;
      }

      const response = await fetch(
        `http://${ipAddress}:3003/conversation/get_messages_from_conversation/${chat_id}`,
        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        }
      );
      const data: [] = await response.json();
      let re_messages: display_message_info[] = [];
      if (data.length == 0) {
        set_messages(re_messages);
        return;
      }
      for (let i = data.length - 1; i > -1; i--) {
        re_messages.push(
          new display_message_info(data[i]["text"], data[i]["author"])
        );
      }
      set_messages(re_messages);
    };
    get_messages(chat_id);
    our_socket.on("some_one_joined_group_chat", ({ conv_id, joined_user_id }: { conv_id: number, joined_user_id: number }) => {
      console.log("someone joined");

      if (joined_user_id != Number(myUserId) && displayed_chat.conversation_id == conv_id) {
        displayed_chat.conversation_participant_arr.push(joined_user_id);
      }
      prep_name_map(displayed_chat.conversation_participant_arr);
    });
    prep_name_map(displayed_chat.conversation_participant_arr);
  }, [chat_id, displayed_chat]);

  useLayoutEffect(() => {
    const windowRef = chatWindow.current;
    if (windowRef) {
      windowRef.scrollTop = windowRef.scrollHeight + 500;
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat window whenever messages change
    const windowRef = chatWindow.current;
    if (windowRef) {
      windowRef.scrollTop = windowRef.scrollHeight + 1000;
    }
  }, [messages]);


  return (
    <div ref={chatWindow} id="displayed-messages" className="whole-chat">
      {messages.map((message, idx) => {
        return (
          <Display_message_in_chat
            key={idx}
            message={message}
          />
        );
      })}
      <DisplayTyping typingDisplay={typingDisplay} />
    </div>
  );
}

export default Display_full_chat;
