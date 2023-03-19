import { useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import Game from './Game'
import Community from './community/CommunityPage'
import { Socket } from 'socket.io-client'


type Props = {}



const HomePage = ({userId} : { userId: string}) => {
	const [gamePage, setGamePage] = useState(true);

  return (
	<div className='game-page'>
		<Header setGamePage={setGamePage} />
		{/* {gamePage ? <Game /> : <Community />} */}
		<Community userId={userId}/>
		{/* <ChatPanel userId={userId}/> */}
		
		<Footer />
	</div>
  )
}

export default HomePage