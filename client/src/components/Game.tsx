import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client'
import Canvas from './Canvas'




const Game = ({socket} : {socket: Socket}) => {


  return (
	<main>
		{/* <GameScreenManagment socket={socket} inLobby={inLobby} gameCode={gameCode}/> */}
		{/* <div className='game-area'> */}
			    <Canvas socket={socket}/>
		{/* </div> */}
	</main>
  )
}

export default Game