import {IoLogoGameControllerA} from 'react-icons/io'
import {MdOutlineVideogameAssetOff} from 'react-icons/md'
import { players } from '../../models/temp-players';

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

export default ListPlayersOnline