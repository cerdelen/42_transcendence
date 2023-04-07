import { useUserContext } from '../contexts/UserContext'
import Canvas from './Canvas'




const Game = () => {
	const { myUserId } = useUserContext();
	return (
		<main>
			{/* <GameScreenManagment socket={socket} inLobby={inLobby} gameCode={gameCode}/> */}
			{/* <div className='game-area'> */}
			<Canvas userId={myUserId} />
			{/* </div> */}
		</main>
	)
}

export default Game