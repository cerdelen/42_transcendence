import { useState } from "react";
import Get_all_my_chats from "./Get_all_my_chats";
import Get_all_other_users from "./All_other_users";



const Community_left_collumn = ({userId, my_chats_ids, setmy_chats_ids} : { userId: string, my_chats_ids: number[], setmy_chats_ids:any}) => {
	return (
		<div className='community-side-collumn'>
			<Get_all_my_chats userId={userId} my_chats_ids={my_chats_ids} setmy_chats_ids={setmy_chats_ids}/>
			<Get_all_other_users />
		</div>
	)
}

export default Community_left_collumn