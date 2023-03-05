import React from 'react'
import JSCookies from "js-cookie";
// type Props = {}
// I want to add our photos and githubs and linked ins
function Creators() {
	const creators: Array<string> = ["Cedric", "Jakub", "Krisi", "Ruslan"];
	const listItems = creators.map((person, id) => <li key={id}>{person}</li>)
	return (
		<ul>{listItems}</ul>
	)
}

function Footer() {

  return (
	<footer>
		{/* <Creators /> */}
		<button onClick={() => console.log(JSCookies.get('accessToken'))} >PRINT TOKEN</button>
	</footer>
  )
}

export default Footer