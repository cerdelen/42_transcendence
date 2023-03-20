import { players } from '../../models/temp-players';
import { useState, useEffect } from 'react';
import { ConversationType } from '../../utils/types';
import { setCommentRange } from 'typescript';
import { ConversationSideBarContainer } from '../../utils/styles';
import { ConversationSideBarUnit } from '../../utils/styles/index';
import { FC } from 'react';
import { useNavigate } from "react-router-dom";
import {useContext} from 'react';
import { AuthContext } from '../../utils/context/AuthContext';
import { ConversationContext } from '../../App';


interface OpenChatProps {
	username: string;
	photo: string;
}

type Props = {
	conversations: ConversationType[];
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

	const [conversation, setConversations] = useState<ConversationType[]>([]);
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const conversations = useContext(ConversationContext);


	// useEffect(() => {
	// 	getConversations()
	// 		.then(({ data }) => {
	// 			setConversations(data);
	// 		})
	// 		.catch((err) => console.log(err)
	// 		)
	// }, []);
	console.log("KOSEGGESKOPFESOPFKOPSEGPKOESPOKGSEPOKGPSEOKFPOEPODLPWQLFPWEOPGKWPOKFPOWEKFPOEW");
		

    return (
        <ul className='scrollable-list open-chats' >
            {/* {players.map((player, idx) => ( */}
				
				 <ConversationSideBarContainer> 
					{conversations.map((convers) => (
						<ConversationSideBarUnit 
							onClick={() => navigate(`/conversation/${convers.id}`)}>
							{/* console.log(user.id); */}
							{user?.id}
							{/* { <OpenChat */}
								{/* username={convers.name} */}
								{/* photo={convers.lastMessage} */}
							{/* /> } */}
						</ConversationSideBarUnit>
					))}

				 </ConversationSideBarContainer> 
					{/* ///we need a way to assign a unique key, something from the database I presume
					// key={Math.floor(Math.random() * 9000000000)} 
					// username={players[2].name}
					// photo={players[2].photo}
				// />	
			// ))} */}
        </ul>
    )
}

export default ListOpenChats