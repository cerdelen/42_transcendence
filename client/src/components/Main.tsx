import React from 'react'
import catFlowersImg from '../images/cat-flowers.jpg' //surrently 100 x 150
import {IoLogoGameControllerA} from 'react-icons/io'
import {MdOutlineVideogameAssetOff} from 'react-icons/md'

const PlayerOnlineCard = () => {

	const playing: boolean = true;
	const status: ( JSX.Element) = playing ? <span>In a game</span> : <button>Challenge</button>;

	console.log(status);

	return (
		<li className='player-card-li'>
			<img src={catFlowersImg} alt="" />
			<div className='player-availability'>
				<span id='user-name'> SvenSvenSvenSvenSvenSvenSvenSven</span>
				<span className='icon'> {playing ? <MdOutlineVideogameAssetOff/> : <IoLogoGameControllerA />} </span>
				{playing ? <span id='in-a-game'>In a game</span> : <button>Challenge</button>}
			</div>

		</li>
	)
}

const ListPlayersOnline = () => {
	return (
		<ul className='game-page-players-online-ul'>
			<PlayerOnlineCard />
		</ul>
	)
}

// type Props = {}

const Main = () => {
  return (
	<main>
		<div className='players-online'>
			<div>PLAYERS ONLINE</div>
			<input type="text" placeholder='SEARCH'/>
			<ListPlayersOnline />
		</div>
		<div className='game-area'>
			<canvas>

			</canvas>

		</div>
		<div className='live-games'>
			2
		</div>
	</main>
  )
}

export default Main