// import React, { useRef, useState } from 'react'


import ProfileCard from './ProfileCard'

type Props = {
	gamePage: boolean;
	setGamePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({gamePage, setGamePage}: Props) => {

	// function handleCLick() {
	// 	setGamePage(!gamePage);
	// 	// alert("I'm here");
	// }

  return (
	<header>
		<div id='logo'>Logo</div>
		<nav>
			<ul>
				<li>
					<span onClick={() => setGamePage(!gamePage)}>Game</span>
				</li>
				<li>
					<span onClick={() => setGamePage(!gamePage)} >Community</span>
				</li>
			</ul>
		</nav>
		<ProfileCard />
	</header>
  )
}

export default Header