import {
  Fragment,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { UserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";
import { our_socket } from "../../utils/context/SocketContext";

interface typing {
  name: string;
  isTyping: boolean;
}

interface message {
  author_id: string;
  text: string;
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
  const { userId } = useContext(UserContext);
  const is_me: boolean = message.author_id == Number(userId);
  const [author, setAuthor] = useState("");
  useEffect(() => {
    const get_user_info = async (id: number) => {
      const response = await fetch("http://localhost:3003/user/user_name", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: JSON.stringify({ user_id: id }),
      });
      const userName = await response.text();

      setAuthor(userName);
    };

    get_user_info(message.author_id);
  });

  return (
    <>
      <div className={`${is_me ? "right-message" : "left-message"} chat-entry`}>
        <div id="message-author">{author}</div>
        <div>{message.text}</div>
      </div>
    </>
  );
};

function Display_full_chat({ chat_id }: { chat_id: number }) {
  const [typingDisplay, setTypingDisplay] = useState("");
  const [messages, set_messages] = useState<Array<display_message_info>>([]);
  const chatWindow = useRef<HTMLDivElement>(null);
  //console.log("called display messages()");
  our_socket.on("message", (message: message) => {
    //console.log("SOCKET ON MESSAGES");

    //console.log(JSON.stringify(messages));

    let newMessage: display_message_info[] = [];
    for (let i = 0; i < messages.length; i++) {
      newMessage.push(messages[i]);
    }
    newMessage.push(
      new display_message_info(message.text, Number(message.author_id))
    );
    // //console.log(`New messages: ${newMessage}`);

    set_messages(newMessage);
  });
  our_socket.on("typing", (typing: typing) => {
    if (typing.isTyping) {
      setTypingDisplay(`${typing.name} is typing ...`);
    } else {
      setTypingDisplay("");
    }
  });
  useEffect(() => {
    const get_messages = async (chat_id: number) => {
      //console.log("GET MESSAGES");

      if (chat_id == -1) {
        //console.log("chat_id == -1 cleaning messages");
        const empty: display_message_info[] = [];
        set_messages(empty);
        return;
      }
      const response = await fetch(
        `http://localhost:3003/conversation/get_messages_from_conversation/${chat_id}`,
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
      // //console.log("this is the data i got " + await JSON.stringify(data));
      //   for (let i = 0; i < data.length; i++) {
      //     re_messages.push(
      //       new display_message_info(data[i]["text"], data[i]["author"])
      //     );
      //   }
      for (let i = data.length - 1; i > -1; i--) {
        re_messages.push(
          new display_message_info(data[i]["text"], data[i]["author"])
        );
      }
      set_messages(re_messages);
    };
    get_messages(chat_id);
}, [chat_id]);

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
      {messages.map((message, idx) => (
        <Display_message_in_chat key={idx} message={message} />
      ))}
      <DisplayTyping typingDisplay={typingDisplay} />
    </div>
  );
}

export default Display_full_chat;
