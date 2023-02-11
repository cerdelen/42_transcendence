import React from 'react'

type Props = {}

const Header = (props: Props) => {
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
		<div>Profile</div>
	</header>
  )
}

export default Header