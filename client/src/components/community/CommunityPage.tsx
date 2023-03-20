import { players } from '../../models/temp-players';
import ListLiveGames from './ListLiveGames';
import ListOpenChats from './ListOpenChats';
import ListPlayersOnline from './ListPLayersOnline';
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

import Chat_cards from '../ChatPanel/chat_side_bar'
import Open_group_cards from '../ChatPanel/open_group_chats_bar';
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import JSCookies from "js-cookie";
import { UserContext } from "../../contexts/UserContext"
import Chat_area from '../ChatPanel/chat_area';
import { useMyChats_user_is_part_of_context } from '../../contexts/Chats_user_is_part_of_context';


// interface message{
//   name: string,
//   message: string,
// }



class display_message_info {
  text: string;
  author_id: number;

  constructor(_text: string, _author_id: number)
  {
    this.text = _text;
    this.author_id = _author_id;
  }
}

interface message{
  author_id: string,
  text: string,
}

interface typing{
  name: string,
  isTyping: boolean,
}
function DisplayTyping({typingDisplay} : {typingDisplay: string})
{
  return <>
  {typingDisplay}
  </>
}

const Display_message_in_chat = ({ message }: { message: display_message_info }) =>
{
  const { userId } = useContext(UserContext);
  const is_me : boolean = (message.author_id == Number(userId));
  // console.log("this is isme " + is_me);
  

  return (
    <>
      <div className={is_me ? 'right_message' : 'left_message'}>
        <div>{message.author_id}</div>
        <div>{message.text}</div>
      </div>
    </>
  );
}

function Display_full_chat({chat_id} : {chat_id : number})
{
  console.log("called display messages()");
	const [messages, set_messages] = useState<Array<display_message_info>>([]);
  useEffect(() => {
    const get_messages = async(chat_id: number) =>
    {
      console.log("this is the get_nessages() this means i will be running a fetch");
      if(chat_id == -1)
      {
        console.log("chat_id == -1 cleaning messages");
        const messages : display_message_info[] = [];
        set_messages(messages)
        return ;
      }
      const response = await fetch(`http://localhost:3003/conversation/get_messages_from_conversation/${chat_id}`, {
				method: "Get",
				headers: {
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			})
      const data : [] = await response.json();
      let messages : display_message_info[] = [];
      if (data.length == 0)
      {
        set_messages(messages);
        return ;
      }
      // console.log("this is the data i got " + await JSON.stringify(data));
      
			for(let i = 0; i < data.length; i++)
      {
        messages.push(new display_message_info(data[i]["text"], data[i]["author"]));
      }
      set_messages(messages);
    } 
    get_messages(chat_id);
  }, [chat_id]);

  console.log("this is the messages"  + JSON.stringify(messages));
  return (
    <>
      {messages.map((message, idx) => (
        <Display_message_in_chat key={idx} message={message}/>
      ))}
    </>
  )
  // return <>{users.map((user : message) => (<li> {"["}{user.name}{"]"} {"\t"} {user.text} </li>))}</>;
}

const Community = ({userId} : { userId: string}) => {
  const [users, setUsers] = useState<message[]>([]);
  const [input, setInput] = useState(""); 
  const [newMessage, setNewMessage] = useState<message>();
  const [typingDisplay, setTypingDisplay] = useState('');
  const [joined, setJoined] = useState(false);
  const { displayed_chat } = useMyDisplayedChatContext();
  const { my_chats_ids, setmy_chats_ids } = useMyChats_user_is_part_of_context();
  // const [name, setName] = useState("");
  // const [name_is_set, name_is_set_set] = useState(false);
  useEffect(() => 
  {
    our_socket.emit('findAllMessages', {}, (response : any[]) =>
    {
      setUsers(response);
    });
    our_socket.on('message', (message : message) => 
    {
      let s : message[] = [...users];
      s.push(message)
      setUsers(s);

      if(our_socket)
    
      our_socket.emit('findAllMessages', {}, (response : any[]) =>
      {
        setUsers(response);
      });
    })

    our_socket.on('typing', (typing: typing) =>
    {
      if(typing.isTyping)
      {
        setTypingDisplay(`${typing.name} is typing ...`);
      }else{
        setTypingDisplay("");
      }
    })
  }, [])
  const join = () =>
  {
    our_socket.emit('join', {name: name}, () => 
    {
      setJoined(true);
    })
  }
  const sendMessage = () =>
  {
    console.log("sendMessage function beginning");
    console.log("this is message text = " + input);
    console.log("this is author = " + Number(userId));
    console.log("this is chat_id = " + displayed_chat);
    our_socket.emit('message', {author: Number(userId), text: input, conversation_id: displayed_chat, created_at: Date.now()}, () => {
      setInput('');
    })
    our_socket.emit('createGame', {});
  }
  let timeout : any;
  const emitTyping = () =>
  {
    console.log("Testing stuff ");
    our_socket.emit('typing', {isTyping: true});
    timeout = setTimeout(() => 
    {
      our_socket.emit('typing', {isTyping: false});
    }, 2000);
  }

    // again, I need a way to know if people are online 
    // const poepleAreOnline: boolean = false;
    // const friendsAreOnline: boolean = true;

 
  return (
    <main id='community'>

        <div className='players-online'>
          <h2>My Chats</h2>
          {/* <input type="text" placeholder='SEARCH'/> */}
          {players.length === 0 ? <div>No one is online </div> : <Chat_cards userId={userId}/>}
		    </div>
       {/* <NamePlace setName={setName} name_is_set={name_is_set}/> */}
        <Chat_area /> 
      	<div className='live-games'>
			<h2>OPEN GROUP CHATS</h2>
			<Open_group_cards />
			{/* <input type="text"/> */}
			{/* <ListLiveGames /> */}

            {/* <h2>CHATS</h2> */}
			{/* <ListOpenChats /> */}
      {/* {showUserInfo && <UserPage />} */}
            
			
		</div>
    </main>
  )
}

export default Community