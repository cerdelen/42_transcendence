import { useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import Game from './Game'
import Community from './community/CommunityPage'
import { Socket } from 'socket.io-client'
import { useMyContext } from '../contexts/InfoCardContext'
import UserPage from './user/UserPage'
import { Outlet } from 'react-router-dom'

const HomePage = () => {

	const { showUserInfo } = useMyContext();
  return (
	<div className='game-page'>
		<Header />
		<Outlet />
		{showUserInfo && <UserPage />}
		<Footer />
	</div>
  )
}

export default HomePage