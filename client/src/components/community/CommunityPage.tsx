import { players } from '../../models/temp-players';
import ListLiveGames from './ListLiveGames';
import ListOpenChats from './ListOpenChats';
import ListPlayersOnline from './ListPLayersOnline';
import { Socket } from 'socket.io';
// import  {io, Socket} from 'socket.io-client';
import { useState, useEffect, Children, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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

// interface message{
//   name: string,
//   message: string,
// }





interface message{
  name: string,
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
function DisplayMessages({users} : {users: message[]})
{
  return <>{users.map((user : message) => (<li> {"["}{user.name}{"]"} {"\t"} {user.text} </li>))}</>;
}
// function NamePlace({setName, name_is_set} : {setName : any,name_is_set: any})
// {
//   if(!name_is_set)
//   {
//     return
//     (<></>)
    
//     {/* { */}
//     // <input onChange={(e) => setName(e.target.value)} />
//   // }
//   }
//   // else{
//     return <></>
//   // }
// }


type Props = {}
// const Community = (props: Props) => {

//   const [messages, setMessages] = useState<MessagesType[]>([]);
//   const socket = useContext(SocketContext)

//   const { id } = useParams();
//   useEffect(()  => {

//     const conversId = parseInt(id!);
//     getConversationMsgs(conversId)
//       .then(({ data }) => {

//         console.log(data);
//         setMessages(data);
//       })
//       .catch((err) => console.log(err))
//     console.log(id);
//   }, [id])

//   useEffect(() => {
//     socket.on('connect',)
//   })
//   // let socket: Socket;
//   // const [users, setUsers] = useState<message[]>([{name: "Vladimir", message: "Siemanko"}, {name: "Ruslan", message: "I guess "}]);
const Community = ({userId} : { userId: string}) => {
  const [users, setUsers] = useState<message[]>([]);
  const [input, setInput] = useState(""); 
  const [newMessage, setNewMessage] = useState<message>();
  const [typingDisplay, setTypingDisplay] = useState('');
  const [joined, setJoined] = useState(false);
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
    console.log(input);
        our_socket.emit('message', {author: Number(userId), text: input, conversation_id: 1, created_at: Date.now()}, () => {
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
			<h2>PLAYERS ONLINE</h2>
			<input type="text" placeholder='SEARCH'/>
			{players.length === 0 ? <div>No one is online </div> : <Chat_cards userId={userId}/>}
		</div>
      {/* <NamePlace setName={setName} name_is_set={name_is_set}/> */}
      
        <div id='chat-area' className='com-areas'>
            <h2>Chat</h2>
             
         
            <div id='displayed-messagees'>
            <DisplayMessages users={users} />
            </div>
            <form onSubmit={(e) => {  e.preventDefault() }}>
            <DisplayTyping typingDisplay={typingDisplay} />
                <input id='chat-input' type="text"  value={input} onInput={emitTyping} onChange={(e) => {
                  setInput(e.target.value);
                }} />

                <button type="submit" onClick={(e) => {
                  console.log("i pressed the button");
                  if(input)
                    sendMessage();
                }
                  }>Senddewfewg</button>

            </form>

        </div>
      	<div className='live-games'>
			<h2>LIVE GAMES</h2>
			<input type="text"/>
			{/* <ListLiveGames /> */}
            <h2>CHATS</h2>
			<ListOpenChats />

            
			
		</div>
    </main>
  )
}

export default Community





   /* //     <ConversationChannelPageStyle>
                  
                  
                  
            //     </ConversationChannelPageStyle> */
            // <div id='displayed-messages'>
            //   {/* {
            //     // users.map((user : message) => <li>{user.name} {"\t"} {user.message} </li>)
            //     messages.map((m) => (
            //         <div>{m.text}</div>
            //       ))
            //     } */}
            //     <MessagePanel messages={messages} />
            // </div>
            // <form onSubmit={() => {}}>
            //     <input id='chat-input' type="text"  onChange={() => {}} />
            //     <button type="submit">Send</button>