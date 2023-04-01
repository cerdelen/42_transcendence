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


type Props = {
	setInviterName: any;
	inviterName : any;
    isInvited: boolean;
    setIsInvited: React.Dispatch<React.SetStateAction<boolean>>;
};

const HomePage = ({setInviterName, inviterName, isInvited, setIsInvited} : Props) => {

	const { showUserInfo, } = useMyContext();
  return (
	<div className='game-page'>
		<Header />
		<Outlet />
		{showUserInfo && <UserPage />}
		<PopUp setInviterName={setInviterName} inviterName={inviterName} isInvited={isInvited} setIsInvited={setIsInvited}/>
		<Footer />
	</div>
  )
}

export default HomePage