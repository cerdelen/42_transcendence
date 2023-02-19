import React, { useRef, useState } from 'react'
import profile from '../images/cat-grass.jpg'
import themeAchievement from '../images/changed-theme-achievement.png'
import threeWinsAchievement from '../images/three-wins-achievement.png'
import halfGamesAchievement from '../images/won-half-of-your-games-achievement.png'
import expertLevel from '../images/expert-level.jpeg'

type Props = {}

const Header = (props: Props) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const firstElementRef = useRef<HTMLDivElement>(null);
	const secondElementRef = useRef<HTMLDivElement>(null);
	
	function handleProfileClick() {
		setIsDropdownOpen(!isDropdownOpen);

		if (firstElementRef.current && secondElementRef.current)
		{
			secondElementRef.current.style.top = `${firstElementRef.current.getBoundingClientRect().bottom}px`;
		}

	}

	const availability: boolean = true;
	const gamesWon: number = 69;
	const username: String = 'Catlin';
  return (
	<header>
		<div>Logo</div>
		<nav>
			<ul>
				<li>
					Game
				</li>
				<li>
					Community
				</li>
			</ul>
		</nav>
		<div className='profile'
			ref={firstElementRef}>
			<span	
					onClick={handleProfileClick}>Profile</span>
			<img src={profile} alt="" />

		{ 
			<div ref={secondElementRef} 
					id="user-dropdown"
					style={{ display: isDropdownOpen ? 'block' : 'none' }}>
				<img src={expertLevel} alt="" />
				<span>{username}</span>
				<span>{availability ? 'online' : 'offline'}</span>
				<span>Games won {gamesWon} </span>
				<div>
					<span>Achievements</span>
					<img src={themeAchievement} alt="" />
					<img src={halfGamesAchievement} alt="" />
					<img src={threeWinsAchievement} alt="" />
				</div>
				<button>Logout</button>
			</div>
		}
		</div>
	</header>
  )
}

export default Header