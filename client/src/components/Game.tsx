import {IoLogoGameControllerA} from 'react-icons/io'
import {MdOutlineVideogameAssetOff} from 'react-icons/md'
import {players} from '../models/temp-players'
import { useState } from 'react'
import React from 'react'
import Canvas from './Canvas'
import Pong from './Pong'

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

export const ListPlayersOnline = () => {
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


const Game = () => {

	///use state for players joining the online queue
  return (
	<main>
		{/* <div className='players-online'>
			<h2>PLAYERS ONLINE</h2>
			<input type="text" placeholder='SEARCH'/>
			{players.length === 0 ? <div>No one is online </div> : <ListPlayersOnline />}
		</div> */}
		<div className='game-area'>
			<Canvas draw={Pong} />
		</div>
		{/* <div className='live-games'>
			<h2>LIVE GAMES</h2>
			<input type="text" placeholder='SEARCH'/>
			<ListLiveGames />
			
		</div> */}
	</main>
  )
}

export default Game