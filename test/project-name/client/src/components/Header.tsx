import React, { useRef, useState } from 'react'


import ProfileCard from './ProfileCard'



const Header = () => {





  return (
	<header>
		<div id='logo'>Logo</div>
		<nav>
			<ul>
				<li>
					<a href="#Game">Game</a>
				</li>
				<li>
					<a href="#Community">Community</a>
				</li>
			</ul>
		</nav>
		<ProfileCard />
	</header>
  )
}

export default Header