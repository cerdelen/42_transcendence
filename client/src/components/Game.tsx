import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client'
import Canvas from './Canvas'




const Game = ({userId} : { userId: string}) => {


  return (
	<main>
		{/* <GameScreenManagment socket={socket} inLobby={inLobby} gameCode={gameCode}/> */}
		{/* <div className='game-area'> */}
		<Canvas userId={userId}/>
		{/* </div> */}
	</main>
  )
}

export default Game