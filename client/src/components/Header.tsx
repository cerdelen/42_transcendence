import React from 'react'
import ProfileCard from './ProfileCard'
import logo from "../images/logo.png";
type Props = {
	gamePage: boolean;
	setGamePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({gamePage, setGamePage}: Props) => {

	function handleCLick() {
		setGamePage(!gamePage);
	}

  return (
	<header>
		<div >
			<img src={logo} alt="" id='logo' />
		</div>

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