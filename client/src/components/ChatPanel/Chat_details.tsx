import { useContext, useEffect, useState } from "react";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import { UserContext } from "../../contexts/UserContext";
import { our_socket } from "../../utils/context/SocketContext";
import JSCookies from "js-cookie";
import { displayed_chat_class } from "../../utils/types";
import Popup_chat_administration from "./Popup_chat_administration";
import { FaCrown } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { RiVolumeMuteFill } from "react-icons/ri";


const handleLeaveChat = (chat_id: number, setDisplayed_chat: React.Dispatch<React.SetStateAction<displayed_chat_class>>, userId:string, not_joined_chats_ids: number[], my_chats_ids: number[], setmy_chats_ids:any, setNot_joined_chats_ids: any, group_chat: boolean|undefined) =>
{
	if (group_chat == false)
		return ;
	if (chat_id != -1)
	{
		our_socket.emit('leave_group_chat', {chat_id: chat_id, userId: userId});
		// const default_chat : displayed_chat_class = { conversation_id: -1, conversation_participant_arr: []}
		// setDisplayed_chat(default_chat);
		// let arr : number [] = []
		// for(let i = 0; i < my_chats_ids.length; i++)
		// {
		// 	if(chat_id != my_chats_ids[i])
		// 	arr.push(my_chats_ids[i]);
		// }
		// setmy_chats_ids(arr);
		// let arr_2 : number [] = []
		// for(let i = 0; i < not_joined_chats_ids.length; i++)
		// {
		// 	arr_2.push(not_joined_chats_ids[i]);
		// }
		// arr_2.push(chat_id);
		// setNot_joined_chats_ids(arr_2);
	}
}

const Participant_in_chat_detail_card = ({user_id, set_user_ids_in_chat_details} : {user_id: number, set_user_ids_in_chat_details: any}) => 
{
	//console.log("calling Participant_in_chat_detail_card for " + user_id);
	
	const { displayed_chat } = useMyDisplayedChatContext();
	// //console.log("called participant chat detail card for id " + user_id);
	const [ is_owner , set_is_owner ] = useState(false);
	const [ is_admin, set_is_admin ] = useState(false);
	const [ is_muted, set_is_muted ] = useState(false);
	const [display_popup, set_display_popup ] = useState(false);
	const [user_name, set_user_name] = useState("");
	useEffect (() => 
	{
		async function get_name()
		{
			try{
				//console.log("get name for " + user_id);
				
				const response = await fetch(`http://localhost:3003/user/user_name`, {
					method: "POST",
					body: JSON.stringify({ user_id: user_id.toString() }),
					headers: {
              			"Content-Type": "application/json",
			  			Authorization: `Bearer ${JSCookies.get("accessToken")}`,
					},
				});

				const user_name_inside = await response.text();
				// //console.log("this is the response . text where we wirkj rughr biw" + data);
				set_user_name(user_name_inside);
			}
			catch(error)
			{
				console.error(error);
			}

		}
		get_name();
	}, []);
	
	if (displayed_chat.conversation_owner_arr?.includes(user_id) && is_owner == false)
		set_is_owner(true);
	if (displayed_chat.conversation_admin_arr?.includes(user_id) && is_admin == false)
		set_is_admin(true);
	if (displayed_chat.conversation_mute_list_arr?.includes(user_id) && is_muted == false)
		set_is_muted(true);

	//console.log(`USERNAME ${user_name}`);
	
	return (
		<div onClick={() => set_display_popup(!display_popup)}>
			<span>{user_name} </span>
			{is_owner && <FaCrown title="owner"/>}
			{is_admin && <RiAdminLine title="admin"/>}
			{is_muted && <RiVolumeMuteFill title="muted"/>}
			{display_popup && <Popup_chat_administration user_id={user_id} setmuted={set_is_muted} setadmin={set_is_admin} setowner={set_is_owner} set_user_ids_in_chat_details={set_user_ids_in_chat_details}/>}
		</div>
	);
}


const	Chat_details = ({not_joined_chats_ids, my_chats_ids, setmy_chats_ids, setNot_joined_chats_ids} : { not_joined_chats_ids: number[], my_chats_ids: number[], setmy_chats_ids:any, setNot_joined_chats_ids: any}) =>
{
	const { displayed_chat, setDisplayed_chat } = useMyDisplayedChatContext();
	const { userId } = useContext(UserContext);
	const [ user_ids_in_chat_details , set_user_ids_in_chat_details] = useState<number[]>([...displayed_chat.conversation_participant_arr]);

	useEffect(() => {
		async function set_map(){
				set_user_ids_in_chat_details([...displayed_chat.conversation_participant_arr]);
		}
		set_map();
	  }, [displayed_chat]);



	return (
		<div className="Chat_details">
			{/* <Chat_details_chat_name displayed_chat={displayed_chat}/> */}
			<div className="Chat_name_for_chat_details">{displayed_chat.conversation_name}</div>

			{/* <div className="Chat_name_for_chat_details">chat_name</div> */}
			{/* <div className="Chat_name_for_chat_details">{chat_name}</div> */}
			{/* <Chat_details_user_list /> */}
			<ul className="User_list_in_chat_detals">
				{user_ids_in_chat_details.map((user_id, idx) => (
					<Participant_in_chat_detail_card user_id={user_id} key={idx} set_user_ids_in_chat_details={set_user_ids_in_chat_details}/>
				))}
				{/* <li className="User_for_list_in_chat_details">User 1</li> */}
				{/* Add more users as needed */}
			</ul>
			<button onClick={() => handleLeaveChat(displayed_chat.conversation_id, setDisplayed_chat, userId, not_joined_chats_ids, my_chats_ids, setmy_chats_ids, setNot_joined_chats_ids, displayed_chat.group_chat)}>Leave Chat</button>
			{/* <button onClick={() => handleLeaveChat(displayed_chat, setDisplayed_chat, userId, not_joined_chats_ids, my_chats_ids, setmy_chats_ids, setNot_joined_chats_ids)}>Leave Chat</button> */}
			{/* <button onClick={handleLeaveChat}>Leave Chat</button> */}
		</div>


	)
}

export default Chat_details