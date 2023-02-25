import React, { useState } from 'react'
import { players } from '../models/temp-players';
import { ListPlayersOnline } from './Game'



interface LiveGameProps {
	username1: string;
	photo1: string;
	username2: string;
	photo2: string;
}
const GameOnlineCard = ({username1, photo1, username2, photo2}: LiveGameProps) => {
	
	const [showText, setShowText] = useState(false);

	const handleMouseOver = () => {
	  setShowText(true);
	};
  
	const handleMouseOut = () => {
	  setShowText(false);
	};

	const handleOnClick = () => {
		alert("A message to ask if you are sure you want to leave the current screen to go watch the game")
	}
	
	return (
		<li className='game-card-li' onClick={handleOnClick} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
			<div>
				<img  src={photo1} alt="" />
				{showText && <span className='game-card-user-name'>{username1}</span>}
			</div>
			
			{!showText ? <span>VS</span> : <span className="vertical-word">Watch</span> }

			<div>
				<img src={photo2} alt=""/>
				{showText && <span className='game-card-user-name'>{username2}</span>}
			</div>
			
		</li>
	)
}

const ListLiveGames = () => {
	return (
		<ul className='game-page-games-online-ul'>
			{players.map((player, idx) => (
				<GameOnlineCard
					username1={players[9].name}
					photo1={players[9].photo}
					username2={players[5].name}
					photo2={players[5].photo}
				/>
			))}
		</ul>
	)
}

type Props = {}
const Community = (props: Props) => {

    // again, I need a way to know if people are online 
    const poepleAreOnline: boolean = false;
    const friendsAreOnline: boolean = true;
  return (
    // <ListPlayersOnline />
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
			
		</div>
    </main>
  )
}

export default Community