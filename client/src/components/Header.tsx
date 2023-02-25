import React from 'react'
import ProfileCard from './ProfileCard'

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
		<div id='logo'>Logo</div>
		<nav>
			<ul>
				<li>
					<span onClick={handleCLick}>Game</span>
				</li>
				<li>
					<span onClick={handleCLick} >Community</span>
				</li>
			</ul>
		</nav>
		<ProfileCard />
	</header>
  )
}

export default Header