import { useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import Game from './Game'
import Community from './community/CommunityPage'


type Props = {}

const HomePage = (props: Props) => {
	const [gamePage, setGamePage] = useState(false);

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