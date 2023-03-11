import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client'
import Canvas from './Canvas'
import Pong from './Pong'

const GameSetup = ({socket, start_game} : {socket: Socket, start_game : boolean}) =>
{
	

	if(start_game)
		return (<Canvas draw={(canvas: any, ctx : any) => Pong(start_game ,canvas, ctx)}  />)
	else{
		
		return (
		<> <h1>
			Waiting for the opponent </h1> </>)
		
	}
} 

const Game = ({socket} : {socket: Socket}) => {
	const [startGame, setStartGame] = useState(false);

	useEffect(() => 
	{
		socket.emit('ready', {});
		socket.on("startGame", () =>
		{
			setStartGame(true);
		})
	}, []);
  return (
	<main>
		<div className='game-area'>
			<GameSetup socket={socket} start_game={startGame} />
		</div>
	</main>
  )
}

export default Game