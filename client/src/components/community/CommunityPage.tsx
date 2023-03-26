import { useState } from 'react';
import Community_left_collumn from '../ChatPanel/Community_left_collumn'
import Open_group_cards from '../ChatPanel/open_group_chats_bar';
import Chat_area from '../ChatPanel/chat_area';

const Community = ({userId} : { userId: string}) => {
	const [not_joined_chats_ids, setNot_joined_chats_ids] = useState<number[]>([]);
  const [my_chats_ids, setmy_chats_ids] = useState<number[]>([]);
  return (
    <main id='community'>
      <Community_left_collumn userId={userId} my_chats_ids={my_chats_ids} setmy_chats_ids={setmy_chats_ids}/>
      <Chat_area /> 
			<Open_group_cards not_joined_chats_ids={not_joined_chats_ids} my_chats_ids={my_chats_ids} setmy_chats_ids={setmy_chats_ids} setNot_joined_chats_ids={setNot_joined_chats_ids}/>
    </main>
  )
}

export default Community