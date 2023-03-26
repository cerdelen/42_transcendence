import { useState, useEffect, useContext } from "react";
import JSCookies from "js-cookie";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import { useRevalidator } from "react-router-dom";
// import Chats_user_is_part_of_context from "../../contexts/Chats_user_is_part_of_context";
import group_picture from "../../images/group_chat_picture.jpeg"
import Get_all_my_chats from "./Get_all_my_chats";
import Get_all_other_users from "./All_other_users";



const Community_left_collumn = ({userId, my_chats_ids, setmy_chats_ids} : { userId: string, my_chats_ids: number[], setmy_chats_ids:any}) => {
	// console.log("rendering Community_left_collumn");
	const [show_chats, set_Show_chats] = useState(false);
	// console.log(test);
	// const { my_chats_ids, setmy_chats_ids } = useContext(Chats_user_is_part_of_context)
	
	return (
		<div className='players-online'>
			{ show_chats ? <button onClick={() => {set_Show_chats(false)}}>Show All Users</button> : <button onClick={() => {set_Show_chats(true)}}>Show My Chats</button>}
			{ show_chats ? 
				<Get_all_my_chats userId={userId} my_chats_ids={my_chats_ids} setmy_chats_ids={setmy_chats_ids}/>
				:
				<Get_all_other_users userId={userId} my_chats_ids={my_chats_ids} setmy_chats_ids={setmy_chats_ids}/>
			}
		{/* <input type="text" placeholder='SEARCH'/> */}
			
		{/* {players.length === 0 ? <div>No one is online </div> : <Community_left_collumn userId={userId}/>} */}
		</div>
	)
}

export default Community_left_collumn