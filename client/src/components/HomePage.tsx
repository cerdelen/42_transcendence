import { useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import Game from './Game'
import Community from './community/CommunityPage'
import { Socket } from 'socket.io-client'
import { useMyContext } from '../contexts/InfoCardContext'
import UserPage from './user/UserPage'
import { Outlet } from 'react-router-dom'
import PopUp from './Popup'


type Props = {
    isInvited: boolean;
    setIsInvited: React.Dispatch<React.SetStateAction<boolean>>;
};

const HomePage = ({isInvited, setIsInvited} : Props) => {

	const { showUserInfo, } = useMyContext();
  return (
	<div className='game-page'>
		<Header />
		<Outlet />
		{showUserInfo && <UserPage />}
		<PopUp isInvited={isInvited} setIsInvited={setIsInvited}/>
		<Footer />
	</div>
  )
}

export default HomePage