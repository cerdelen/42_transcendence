import { useContext, useEffect, useState } from "react";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import { UserContext } from "../../contexts/UserContext";
import { our_socket } from "../../utils/context/SocketContext";
import JSCookies from "js-cookie";
import { displayed_chat_class } from "../../utils/types";




// const handleLeaveChat = () =>
const handleLeaveChat = (chat_id: number, setDisplayed_chat: React.Dispatch<React.SetStateAction<displayed_chat_class>>, userId:string, not_joined_chats_ids: number[], my_chats_ids: number[], setmy_chats_ids:any, setNot_joined_chats_ids: any) =>
{
	if (chat_id != -1)
	{

		console.log("handleLeaveChat ");
		our_socket.emit('leave_group_chat', {chat_id: chat_id, userId: userId});
		const default_chat : displayed_chat_class = { conversation_id: -1}
		setDisplayed_chat(default_chat);
		let arr : number [] = []
		for(let i = 0; i < my_chats_ids.length; i++)
		{
			if(chat_id != my_chats_ids[i])
			arr.push(my_chats_ids[i]);
		}
		setmy_chats_ids(arr);
		let arr_2 : number [] = []
		for(let i = 0; i < not_joined_chats_ids.length; i++)
		{
			arr_2.push(not_joined_chats_ids[i]);
		}
		arr_2.push(chat_id);
		setNot_joined_chats_ids(arr_2);
	}
}

const	Chat_details_chat_name = (displayed_chat: {displayed_chat: number}) =>
{
	const [chat_name, set_name] = useState("");

	console.log("GIOEWJIFEWOPKFPEOWKDFP{EWKOFE{PWOFKPEKWPFEWKP{FDLEW{PFLP{EW{PFLEWLP      " + displayed_chat.displayed_chat);
	

	useEffect(() => {
		async function get_name(){
			const response = await fetch(`http://localhost:3003/conversation/getConversationNameById/${displayed_chat.displayed_chat}`, {
				method: "Get",
				headers: {
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			})
			if (response.ok)
			{
				const data : string = await response.json();
				set_name(data);
			}
		}
		get_name();
	  }, []);

	  console.log(chat_name + " this is the chat name i foudn for details");
	  

	  return (
		<div className="Chat_name_for_chat_details">{chat_name}</div>
	  )
}

const	Chat_details = ({not_joined_chats_ids, my_chats_ids, setmy_chats_ids, setNot_joined_chats_ids} : { not_joined_chats_ids: number[], my_chats_ids: number[], setmy_chats_ids:any, setNot_joined_chats_ids: any}) =>
{
	const { displayed_chat, setDisplayed_chat } = useMyDisplayedChatContext();
	const { userId } = useContext(UserContext);

	// const [chat_name, set_name] = useState("");

	// useEffect(() => {
	// 	async function get_name(){
	// 		const response = await fetch(`http://localhost:3003/conversation/getConversationNameById/${displayed_chat}`, {
	// 			method: "Get",
	// 			headers: {
	// 				Authorization: `Bearer ${JSCookies.get("accessToken")}`,
	// 			},
	// 		})
	// 		if (response.ok)
	// 		{
	// 			const data : string = await response.json();
	// 			set_name(data);
	// 		}
	// 	}
	// 	get_name();
	//   }, []);



	return (
		<div className="Chat_details">
			{/* <Chat_details_chat_name displayed_chat={displayed_chat}/> */}
			<div className="Chat_name_for_chat_details">{displayed_chat.conversation_name}</div>

			{/* <div className="Chat_name_for_chat_details">chat_name</div> */}
			{/* <div className="Chat_name_for_chat_details">{chat_name}</div> */}
			{/* <Chat_details_user_list /> */}
			<ul className="User_list_in_chat_detals">
				<li className="User_for_list_in_chat_details">User 1</li>
				<li className="User_for_list_in_chat_details">User 2</li>
				<li className="User_for_list_in_chat_details">User 3</li>
				<li className="User_for_list_in_chat_details">User 4</li>
				<li className="User_for_list_in_chat_details">User 5</li>
				<li className="User_for_list_in_chat_details">User 6</li>
				<li className="User_for_list_in_chat_details">User 7</li>
				<li className="User_for_list_in_chat_details">User 8</li>
				<li className="User_for_list_in_chat_details">User 9</li>
				<li className="User_for_list_in_chat_details">User 10</li>
				{/* Add more users as needed */}
			</ul>
			<button onClick={() => handleLeaveChat(displayed_chat.conversation_id, setDisplayed_chat, userId, not_joined_chats_ids, my_chats_ids, setmy_chats_ids, setNot_joined_chats_ids)}>Leave Chat</button>
			{/* <button onClick={() => handleLeaveChat(displayed_chat, setDisplayed_chat, userId, not_joined_chats_ids, my_chats_ids, setmy_chats_ids, setNot_joined_chats_ids)}>Leave Chat</button> */}
			{/* <button onClick={handleLeaveChat}>Leave Chat</button> */}
		</div>


	)
}

export default Chat_details