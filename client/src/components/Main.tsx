import {IoLogoGameControllerA} from 'react-icons/io'
import {MdOutlineVideogameAssetOff} from 'react-icons/md'
import {players} from './temp-players'

import catYellowImg from '../images/cat-yellow.jpg'
import catLyingImg from '../images/cat-lying.jpg'
interface PlayerProps {
	username: string;
	photo: string;
	playing: boolean;
	status: JSX.Element;
	
}

const PlayerOnlineCard = ({username, photo, playing, status}: PlayerProps) => {

	return (
		<li className='player-card-li'>
			<img src={photo} alt="" />
			<div className='player-availability'>
				<span id='user-name' title={username}> {username} </span>
				<span className='icon'> {playing ? <MdOutlineVideogameAssetOff/> : <IoLogoGameControllerA />} </span>
				{status}
			</div>

		</li>
	)
}

const ListPlayersOnline = () => {
	return (
		<ul className='game-page-players-online-ul'>
			{players.map((player, idx) => (
				<PlayerOnlineCard 
					key={idx} //kill me father for I am about to sin and destroy this pc
					username={player.name} 
					photo={player.photo}
					playing={player.playing}
					status={player.status}
				/>
			))}
		</ul>
	)
}

const GameOnlineCard = () => {
	return (
		<li className='game-card-li'>

			<img src={catLyingImg} alt="" />
			<span>VS</span>
			<img src={catYellowImg} alt="" />


		</li>
	)
}

const ListLiveGames = () => {
	return (
		<ul className='game-page-games-online-ul'>
			{players.map((player, idx) => (
				<GameOnlineCard/>
			))}
		</ul>
	)
}
const Main = () => {
  return (
	<main>
		<div className='players-online'>
			<h2>PLAYERS ONLINE</h2>
			<input type="text" placeholder='SEARCH'/>
			<ListPlayersOnline />
		</div>
		<div className='game-area'>
			<canvas>

			</canvas>

		</div>
		<div className='live-games'>
			<h2>LIVE GAMES</h2>
			<input type="text" placeholder='SEARCH'/>
			<ListLiveGames />
			
		</div>
	</main>
  )
}

export default Main