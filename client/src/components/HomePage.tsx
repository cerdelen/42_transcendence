import React, { useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import Game from './Game'
import Community from './CommunityPage'


type Props = {}

const HomePage = (props: Props) => {
	// const game: boolean = false;
	const [gamePage, setGamePage] = useState(false);

  return (
	<div className='game-page'>
		<Header gamePage={gamePage} setGamePage={setGamePage} />
		{gamePage ? <Game /> : <Community />}
		
		<Footer />
	</div>
  )
}

export default HomePage