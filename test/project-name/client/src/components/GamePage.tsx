import React from 'react'
import Footer from './Footer'
import Header from './Header'
import Main from './Main'


type Props = {}

const TestPage = (props: Props) => {
  return (
	<div className='game-page'>
		<Header />
		<Main />
		<Footer />
	</div>
  )
}

export default TestPage