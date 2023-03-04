import { useState } from 'react'
import { players } from '../../models/temp-players';

interface LiveGameProps {
	username1: string;
	photo1: string;
	username2: string;
	photo2: string;
}


const GameOnlineCard = ({username1, photo1, username2, photo2}: LiveGameProps) => {
	
	const [showText, setShowText] = useState(false);
	
	const handleMouseOver = () => {setShowText(true);};
	const handleMouseOut = () => {setShowText(false);};
	const handleOnClick = () => {alert("What do here?");}
	
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
					///we need a way to assign a unique key, something from the database I presume
					key={Math.floor(Math.random() * 9000000000)} 
					username1={players[9].name}
					photo1={players[9].photo}
					username2={players[5].name}
					photo2={players[5].photo}
				/>
			))}
		</ul>
	)
}


export default ListLiveGames