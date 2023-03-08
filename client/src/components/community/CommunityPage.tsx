import { players } from '../../models/temp-players';
import ListLiveGames from './ListLiveGames';
import ListOpenChats from './ListOpenChats';
import ListPlayersOnline from './ListPLayersOnline';
import { Socket } from 'socket.io';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';


interface message{
  name: string,
  text: string,
}
function DisplayMessages({users} : {users: message[]})
{
  return <>{users.map((user : message) => (<li> {"["}{user.name}{"]"} {"\t"} {user.text} </li>))}</>;
}


type Props = {}
const Community = (props: Props) => {
  const [users, setUsers] = useState<message[]>([]);
  const socket : any = io('http://localhost:3003');
  const [input, setInput] = useState(""); 
  const [newMessage, setNewMessage] = useState<message>();
  useEffect(() => 
  {
    socket.emit('findAllMessages', {}, (response : any[]) =>
    {
      setUsers(response);
    });
    socket.on('message', (message : message) => 
    {
      setNewMessage(message);
    }, () => {})
  }, [])

  const sendMessage = () =>
  {
    socket.emit('createMessage', {name: "Mock user", text: input}, () => {
      // let newInput : string = input;

      setInput('');
    })
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
        <div id='chat-area' className='com-areas'>
            <h2>Chat</h2>
            <div id='displayed-messages'>
            <DisplayMessages users={users} />
            </div>
            <form onSubmit={(e) => {  e.preventDefault() }}>
                <input id='chat-input' type="text"  value={input} onChange={(e) => {
                  setInput(e.target.value);
                }} />
                <button type="submit" onClick={(e) => {
                  if(input)
                    sendMessage( );
                }}>Send</button>
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