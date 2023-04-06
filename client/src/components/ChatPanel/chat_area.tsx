import { useEffect, useState } from "react";
import { useContext } from "react";
import { our_socket } from "../../utils/context/SocketContext";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import Display_full_chat from "./display_full_chat";
import { UserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";
import CatSvg from "../../svg/peeking-cat.svg"
const ipAddress = process.env.REACT_APP_Server_host_ip;

const Chat_input_filed_and_send_button = () => {
  const [input, setInput] = useState("");
  const { displayed_chat } = useMyDisplayedChatContext();
  const { userId } = useContext(UserContext);

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Send message");
    our_socket.emit( "message", {
        author: Number(userId),
        text: input,
        conversation_id: displayed_chat.conversation_id,
        created_at: Date.now(),
      },
    );
    setInput("");
  };
  let timeout: any;
  const emitTyping = () => {
      console.log("i am emitting typing");
    our_socket.emit("typing", { isTyping: true, userId: userId, chat_id: displayed_chat.conversation_id });
    timeout = setTimeout(() => {
      our_socket.emit("typing", { isTyping: false, userId: userId, chat_id: displayed_chat.conversation_id });
    }, 2000);
  };

  return (
    <form onSubmit={(e) => {
      if (input) sendMessage(e);
    }}>
      <input
        id="chat-input"
        type="text"
        value={input}
        onInput={emitTyping}
        onChange={(e) => {
          console.log(e.target.value);
          setInput(e.target.value);
        }}
      />
      <button id="chat-button">Send</button>
    </form>
  );
};

const Chat_area = () => {
  const { displayed_chat, setDisplayed_chat } = useMyDisplayedChatContext();
	const { userId } = useContext(UserContext);
	const [ reset_displayed_chat, set_reset_displayed_chat] = useState(displayed_chat.conversation_id);

  our_socket.on("some_one_joined_group_chat", ({conv_id, joined_user_id} : {conv_id: number, joined_user_id: number}) =>
		{	
			if (joined_user_id == Number(userId))
			{
        set_reset_displayed_chat(conv_id);
			}
		});

  useEffect(() => {
		const set_new_displayed_chat = async () =>
		{
			try {
				if (reset_displayed_chat !== -1){
					const response = await fetch(`http://${ipAddress}:3003/conversation/getConversationById/${reset_displayed_chat}`, {
						method: "Get",
						headers: {
							Authorization: `Bearer ${JSCookies.get("accessToken")}`,
						},
					});
					const conv = await response.json();
          console.log("RESEING WHOLE CONV");
					setDisplayed_chat(conv);
				}
			}
      catch (error)
      {
				console.log(error);	
			}
		}
		set_new_displayed_chat();
	}, [reset_displayed_chat]);

  return (
    <div id="chat-area">
      {displayed_chat.conversation_id == -1 ? (
        <div className="no-open-chats">
          <h2>You have no open chats {displayed_chat.conversation_name}</h2>
          <img src={CatSvg}/>
        </div>
      ) : (
        <>
          <h2>Chat {displayed_chat.conversation_name}</h2>
          <Display_full_chat chat_id={displayed_chat.conversation_id} />
            <Chat_input_filed_and_send_button />
        </>
      )}
    </div>
  );
};

export default Chat_area;