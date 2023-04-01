import { useState } from 'react'
import JSCookies from "js-cookie";
import { useContext, useEffect } from "react";
import Footer from './Footer'
import Header from './Header'
import Game from './Game'
import Community from './community/CommunityPage'
import { Socket } from 'socket.io-client'
import { useMyContext } from '../contexts/InfoCardContext'
import UserPage from './user/UserPage'
import { Outlet } from 'react-router-dom'
import PopUp from './Popup'
import { useMyProfile_picture_Context } from '../contexts/Profile_picture_context'
import { UserContext } from '../contexts/UserContext'

const HomePage = () => {

	const { showUserInfo } = useMyContext();
	
	return (
		<div className='game-page'>

			<Header />
			<Outlet />
			{showUserInfo && <UserPage />}
			<PopUp />
			<Footer />
		</div>
	)
}

export default HomePage