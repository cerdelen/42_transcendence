import Canvas from './Canvas'
import Pong from './Pong'

const Game = () => {
  return (
	<main>
		<div className='game-area'>
			<Canvas draw={Pong} />
		</div>
	</main>
  )
}

export default Game