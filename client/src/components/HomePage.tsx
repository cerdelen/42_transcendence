import { useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import Game from './Game'
import Community from './community/CommunityPage'
import { Socket } from 'socket.io-client'
import { useMyContext } from '../contexts/InfoCardContext'
import UserPage from './user/UserPage'


type Props = {}

const ChatPage = () =>
{
	return (
		<>HELLO this is chatpage</>
	)
}

const HomePage = ({userId} : { userId: string}) => {

	const { showUserInfo } = useMyContext();
	const [gamePage, setGamePage] = useState(false);
	// const [pageState, setPageState] = useState(2);

  return (
	<div className='game-page'>
		<Header setGamePage={setGamePage} />
		{ gamePage ? <Game userId={userId}/> : <Community userId={userId}/>}
		{/* { pageState == 0 ? <Game userId={userId}/> : <></>}
		{ pageState == 2 ? <ChatPage /> : <></> }
		{ pageState == 1 ? <Community userId={userId}/> : <></> } */}
		{/* { pageState == 2 ? <Game userId={userId}/> : <Community userId={userId}/>} */}
		{/* <Community userId={userId}/> */}
		{/* <ChatPanel userId={userId}/> */}
		{showUserInfo && <UserPage />}
		<Footer />
	</div>
  )
}

export default HomePage