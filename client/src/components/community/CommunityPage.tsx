import { players } from '../../models/temp-players';
import ListLiveGames from './ListLiveGames';
import ListOpenChats from './ListOpenChats';
import ListPlayersOnline from './ListPLayersOnline';
import { Socket } from 'socket.io';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getConversationMsgs } from '../../utils/apis';
import { MessagesType } from '../../utils/types';


// interface message{
//   name: string,
//   message: string,
// }




// const Message = (messages: message[]   ) =>
// {
//   return messages.map((message : message) => <li>{message.name} </li>);
// };
type Props = {}
const Community = (props: Props) => {

  const [messages, setMessages] = useState<MessagesType[]>([]);

  const { id } = useParams();
  useEffect(()  => {

    const conversId = parseInt(id!);
    getConversationMsgs(conversId)
      .then(({ data }) => {

        console.log(data);
        setMessages(data);
      })
      .catch((err) => console.log(err))
    console.log(id);
  }, [id])
  // let socket: Socket;
  // const [users, setUsers] = useState<message[]>([{name: "Vladimir", message: "Siemanko"}, {name: "Ruslan", message: "I guess "}]);


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
              {
                // users.map((user : message) => <li>{user.name} {"\t"} {user.message} </li>)
                messages.map((m) => (
                  <div>{m.text}</div>
                ))
              }
            </div>
            <form onSubmit={() => {}}>
                <input id='chat-input' type="text"  onChange={() => {}} />

                <button type="submit">Send</button>
            </form>

        </div>
      	<div className='live-games'>
			<h2>LIVE GAMES</h2>
			<input type="text" placeholder='SEARCH'/>
			<ListLiveGames />
            <h2>CHATS</h2>
			<ListOpenChats />
            
			
		</div>
    </main>
  )
}

export default Community