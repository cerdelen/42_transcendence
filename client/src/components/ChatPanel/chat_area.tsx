import { useState, useEffect, Children, useMemo } from 'react';
import {useContext} from 'react';
import { SocketContext, our_socket} from '../../utils/context/SocketContext';
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import Display_full_chat from './display_full_chat';
import { UserContext } from "../../contexts/UserContext"

interface message{
  author_id: string,
  text: string,
}

interface typing{
  name: string,
  isTyping: boolean,
}

// class display_message_info {
// 	text: string;
// 	author_id: number;

// 	constructor(_text: string, _author_id: number)
// 	{
// 		this.text = _text;
// 		this.author_id = _author_id;
// 	}
// }

const Chat_input_filed_and_send_button = () =>
{
	const [input, setInput] = useState(""); 
	const { displayed_chat } = useMyDisplayedChatContext();
	const { userId } = useContext(UserContext);

	const sendMessage = () =>
	{
	//   console.log("sendMessage function beginning");
	//   console.log("this is message text = " + input);
	//   console.log("this is author = " + Number(userId));
	//   console.log("this is chat_id = " + displayed_chat.conversation_id);
	  our_socket.emit('message', {author: Number(userId), text: input, conversation_id: displayed_chat.conversation_id, created_at: Date.now()}, () => {
	})
		setInput('');
	}
	let timeout : any;
	const emitTyping = () =>
	{
	//   console.log("i am emitting typing");
	  our_socket.emit('typing', {isTyping: true, userId: userId});
	  timeout = setTimeout(() => 
	  {
		our_socket.emit('typing', {isTyping: false, userId: userId});
	  }, 2000);
	}

	return (
		<>
			<input id='chat-input' type="text"  value={input} onInput={emitTyping} onChange={(e) => {
				setInput(e.target.value);
			}} />
			<button type="submit" onClick={(e) => {
				if(input)
				sendMessage();
			}}>Send</button>
			</>
	)
}

const Chat_area = () =>
{
	const [users, setUsers] = useState<message[]>([]);
	const [newMessage, setNewMessage] = useState<message>();
	const [joined, setJoined] = useState(false);
	const { displayed_chat } = useMyDisplayedChatContext();
	// const [messages, set_messages] = useState<Array<display_message_info>>([]);

	return (
		<div id='chat-area' className='com-areas'>
            <h2>Chat  {displayed_chat.conversation_name}</h2>
            <div id='displayed-messagees'>
              <Display_full_chat chat_id={displayed_chat.conversation_id} />
            </div>
            <form onSubmit={(e) => {  e.preventDefault() }}>
				<Chat_input_filed_and_send_button />
            </form>
        </div>
	)
}

export default Chat_area