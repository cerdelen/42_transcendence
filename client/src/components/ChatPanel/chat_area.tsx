import { useEffect, useState } from "react";
import { useContext } from "react";
import { our_socket } from "../../utils/context/SocketContext";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import Display_full_chat from "./display_full_chat";
import { UserContext } from "../../contexts/UserContext";
import empty_chat_picture from "../../images/sleeping_cat.jpeg";
import JSCookies from "js-cookie";

interface message {
  author_id: string;
  text: string;
}

const Chat_input_filed_and_send_button = () => {
  const [input, setInput] = useState("");
  const { displayed_chat } = useMyDisplayedChatContext();
  const { userId } = useContext(UserContext);

  const sendMessage = () => {;
    our_socket.emit( "message", {
        author: Number(userId),
        text: input,
        conversation_id: displayed_chat.conversation_id,
        created_at: Date.now(),
      },
      () => {}
    );
    setInput("");
  };
  let timeout: any;
  const emitTyping = () => {
    //   console.log("i am emitting typing");
    our_socket.emit("typing", { isTyping: true, userId: userId, chat_id: displayed_chat.conversation_id });
    timeout = setTimeout(() => {
      our_socket.emit("typing", { isTyping: false, userId: userId, chat_id: displayed_chat.conversation_id });
    }, 2000);
  };

  return (
    <>
      <input
        id="chat-input"
        type="text"
        value={input}
        onInput={emitTyping}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <button
        type="submit"
        onClick={(e) => {
          if (input) sendMessage();
        }}
      >
        Send
      </button>
    </>
  );
};

const Chat_area = () => {
  const { displayed_chat, setDisplayed_chat } = useMyDisplayedChatContext();
	const { userId } = useContext(UserContext);
	const [ reset_displayed_chat, set_reset_displayed_chat] = useState(displayed_chat.conversation_id);

console.log("I WANNA RESET EVERTHNG HERE" + reset_displayed_chat);

  our_socket.on("some_one_joined_group_chat", ({conv_id, joined_user_id} : {conv_id: number, joined_user_id: number}) =>
		{	
      console.log("hello this is subscriber to some_one_joined_group_chat");

			if (joined_user_id == Number(userId))
			{
        console.log("HLELOOO IN THE IF, " + conv_id);
        set_reset_displayed_chat(conv_id);
			}
		});

  useEffect(() => {
		const set_new_displayed_chat = async () =>
		{
			try {
        console.log("tryin so hard");
        
				if (reset_displayed_chat !== -1){
					const response = await fetch(`http://localhost:3003/conversation/getConversationById/${reset_displayed_chat}`, {
						method: "Get",
						headers: {
							// "Content-Type": "application/json",
							Authorization: `Bearer ${JSCookies.get("accessToken")}`,
						},
					});
					const conv = await response.json();
          console.log("RESEING WHOLE CONV");
          
					setDisplayed_chat(conv);
				}
			} catch (error) {
				console.log(error);	
			}
		}
		set_new_displayed_chat();
	}, [reset_displayed_chat]);
  
  

  return (
    <div id="chat-area" className="com-areas">
      {displayed_chat.conversation_id == -1 ? (
        <>
          <h2>You have no open chats {displayed_chat.conversation_name}</h2>
          <img src={empty_chat_picture} />
          <div></div>
        </>
      ) : (
        <>
          <h2>Chat {displayed_chat.conversation_name}</h2>
          <Display_full_chat chat_id={displayed_chat.conversation_id} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Chat_input_filed_and_send_button />
          </form>
        </>
      )}
    </div>
  );
};

export default Chat_area;
