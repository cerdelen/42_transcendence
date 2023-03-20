
import { players } from '../../models/temp-players';
// import ListLiveGames from './ListLiveGames';
// import ListOpenChats from './ListOpenChats';
// import ListPlayersOnline from './ListPLayersOnline';
import { Socket } from 'socket.io';
// import  {io, Socket} from 'socket.io-client';
import { useState, useEffect, Children, useMemo } from 'react';
import { json, useParams } from 'react-router-dom';
// import { getConversationMsgs } from '../../utils/apis';
import { MessagesType } from '../../utils/types';
import { ConversationType } from '../../utils/types';
import { MessagePanel } from '../../messages/MessagePanel';
// import { ConversationChannelPageStyle } from '../../utils/styles';
import {useContext} from 'react';
import { SocketContext, our_socket} from '../../utils/context/SocketContext';
import UserPage from '../user/UserPage';
import { useMyContext } from '../../contexts/InfoCardContext';

import Chat_cards from './Community_left_collumn'
import Open_group_cards from '../ChatPanel/open_group_chats_bar';
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import JSCookies from "js-cookie";
import Display_full_chat from './display_full_chat';
import { UserContext } from "../../contexts/UserContext"

// interface message{
//   name: string,
//   message: string,
// }




interface message{
  author_id: string,
  text: string,
}

interface typing{
  name: string,
  isTyping: boolean,
}


const Chat_input_filed_and_send_button = () =>
{
	const [input, setInput] = useState(""); 
	const { displayed_chat } = useMyDisplayedChatContext();
	const { userId } = useContext(UserContext);

	const sendMessage = () =>
	{
	  console.log("sendMessage function beginning");
	  console.log("this is message text = " + input);
	  console.log("this is author = " + Number(userId));
	  console.log("this is chat_id = " + displayed_chat);
	  our_socket.emit('message', {author: Number(userId), text: input, conversation_id: displayed_chat, created_at: Date.now()}, () => {
		setInput('');
	  })
	}
	let timeout : any;
	const emitTyping = () =>
	{
	  console.log("i am emitting typing");
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


	return (
		<div id='chat-area' className='com-areas'>
            <h2>Chat  {displayed_chat}</h2>

            <div id='displayed-messagees'>
              <Display_full_chat chat_id={displayed_chat} />
            </div>
            <form onSubmit={(e) => {  e.preventDefault() }}>
			<Chat_input_filed_and_send_button />

            </form>

        </div>
	)
}

export default Chat_area