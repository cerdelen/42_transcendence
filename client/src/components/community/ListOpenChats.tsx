import { players } from '../../models/temp-players';

interface OpenChatProps {
	username: string;
	photo: string;
}

const OpenChat = ({username, photo}: OpenChatProps) => {

	return (
		<li id='open-chat-card'>
			<span id='user-name' title={username}> {username} </span>
			<img src={photo} alt="" />
		</li>
	)
}

const ListOpenChats = () => {
    return (
        <ul className='scrollable-list open-chats' >
            {players.map((player, idx) => (
				<OpenChat
					username={players[2].name}
					photo={players[2].photo}
				/>
			))}
        </ul>
    )
}

export default ListOpenChats