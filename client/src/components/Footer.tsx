import React from 'react'

type Props = {}
// I want to add our photos and githubs and linked ins
function Creators() {
	const creators: Array<string> = ["Cedric", "Jakub", "Krisi", "Ruslan"];
	const listItems = creators.map(person => <li>{person}</li>)
	return (
		<ul>{listItems}</ul>
	)
}

function Footer({}: Props) {

  return (
	<footer>
		<Creators />
	</footer>
  )
}

export default Footer