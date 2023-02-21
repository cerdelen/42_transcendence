import React from 'react'
import { ListPlayersOnline } from './Game'

type Props = {}

const Community = (props: Props) => {

    // again, I need a way to know if people are online 
    const poepleAreOnline: boolean = false;
    const friendsAreOnline: boolean = true;
  return (
    // <ListPlayersOnline />
    <main id='community'>
        <div id='lobby-area' className='com-areas'>
            <h2>Friends</h2>
            <input type="text" placeholder='SEARCH'/>
            {friendsAreOnline ? <span>Lisst frineds here</span> : <span>No one is online</span> }
        </div>
        <div id='chat-area' className='com-areas'>
            <h2>Chat</h2>
            <div>See messages</div>
            <div>Write messages</div>

        </div>
        <div id='friends-area' className='com-areas'>
            <h2>Lobby</h2>
            <input type="text" placeholder='SEARCH'/>
            {poepleAreOnline ? <span>Players</span> : <span>No one is online</span> }
        </div>
    </main>
  )
}

export default Community