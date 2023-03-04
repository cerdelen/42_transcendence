import { players } from '../../models/temp-players';
import ListLiveGames from './ListLiveGames';
import ListOpenChats from './ListOpenChats';
import ListPlayersOnline from './ListPLayersOnline';






type Props = {}
const Community = (props: Props) => {

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
            <div id='displayed-messages'>See messages</div>
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