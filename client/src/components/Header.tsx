import React, { useRef, useState } from 'react'


import ProfileCard from './ProfileCard'

type Props = {
	gamePage: boolean;
	setGamePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({gamePage, setGamePage}: Props) => {

	function handleCLick() {
		setGamePage(!gamePage);
		// alert("I'm here");
	}

  return (
	<header>
		<div id='logo'>Logo</div>
		<nav>
			<ul>
				<li>
					<a href="#Game" onClick={handleCLick}>Game</a>
				</li>
				<li>
					<a href="#Community" onClick={handleCLick} >Community</a>
				</li>
			</ul>
		</nav>
		<ProfileCard />
	</header>
  )
}

export default Header