import { useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import Game from './Game'
import Community from './community/CommunityPage'
import { Socket } from 'socket.io-client'


type Props = {}



const HomePage = () => {
	const [gamePage, setGamePage] = useState(true);

  return (
	<div className='game-page'>
		<Header setGamePage={setGamePage} />
		{/* {gamePage ? <Game /> : <Community />} */}
		<Community />
		
		<Footer />
	</div>
  )
}

export default HomePage