import { players } from '../../models/temp-players';
import ListLiveGames from './ListLiveGames';
import ListOpenChats from './ListOpenChats';
import ListPlayersOnline from './ListPLayersOnline';
import io, { Socket} from 'socket.io-client';
import { useEffect, useMemo, useState } from 'react';


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
const Community = ({socket} : {socket: Socket}) => {
  const [users, setUsers] = useState<message[]>([]);
  const [input, setInput] = useState(""); 
  const [newMessage, setNewMessage] = useState<message>();
  const [typingDisplay, setTypingDisplay] = useState('');
  const [joined, setJoined] = useState(false);
  // const [name, setName] = useState("");
  // const [name_is_set, name_is_set_set] = useState(false);
  useEffect(() => 
  {
    socket.emit('findAllMessages', {}, (response : any[]) =>
    {
      setUsers(response);
    });
    socket.on('message', (message : message) => 
    {
      let s : message[] = [...users];
      s.push(message)
      setUsers(s);

      if(socket)
    
        socket.emit('findAllMessages', {}, (response : any[]) =>
      {
        setUsers(response);
      });
    })

    socket.on('typing', (typing: typing) =>
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
    socket.emit('join', {name: name}, () => 
    {
      setJoined(true);
    })
  }
  const sendMessage = (socket : Socket) =>
  {
        socket.emit('createMessage', {name: "Mock user", text: input}, () => {
          setInput('');
        })
        socket.emit('createGame', {});
  }
  let timeout : any;
  const emitTyping = () =>
  {
    console.log("Testing stuff ");
    socket.emit('typing', {isTyping: true});
    timeout = setTimeout(() => 
    {
      socket.emit('typing', {isTyping: false});
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
			{players.length === 0 ? <div>No one is online </div> : <ListPlayersOnline />}
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
                  if(input)
                    sendMessage(socket);
                }
                  }>Send</button>

            </form>

        </div>
      	<div className='live-games'>
			<h2>LIVE GAMES</h2>
			<input type="text"/>
			<ListLiveGames />
            <h2>CHATS</h2>
			<ListOpenChats />
            
			
		</div>
    </main>
  )
}

export default Community