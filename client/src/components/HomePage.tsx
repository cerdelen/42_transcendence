import { useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import Game from './Game'
import Community from './community/CommunityPage'
import { Socket } from 'socket.io-client'
import { useMyContext } from '../contexts/InfoCardContext'
import UserPage from './user/UserPage'


type Props = {}



const HomePage = ({userId} : { userId: string}) => {
	const [gamePage, setGamePage] = useState(true);
	const { showUserInfo } = useMyContext();
  return (
	<div className='game-page'>
		<Header setGamePage={setGamePage} />
		{gamePage ? <Game userId={userId}/> : <Community userId={userId}/>}
		{/* <Community userId={userId}/> */}
		{/* <ChatPanel userId={userId}/> */}
		{showUserInfo && <UserPage />}
		<Footer />
	</div>
  )
}

export default HomePage