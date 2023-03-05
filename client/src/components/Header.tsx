import React from 'react'
import ProfileCard from './profile/ProfileCard'
import logo from "../images/logo.png";
type Props = {
	setGamePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({setGamePage}: Props) => {

  return (
	<header>
		<img src={logo} alt="" id='logo' />
		<nav>
			<ul>
				<li>
					<span className='basic' onClick={() => setGamePage(true)}>Game</span>
				</li>
				<li>
					<span className='basic' onClick={() => setGamePage(false)} >Community</span>
				</li>
			</ul>
		</nav>
		<ProfileCard />
	</header>
  )
}

export default Header