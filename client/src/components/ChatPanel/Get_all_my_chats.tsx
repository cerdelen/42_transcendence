import { useState, useEffect, useContext } from "react";
import JSCookies from "js-cookie";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import { useRevalidator } from "react-router-dom";
// import Chats_user_is_part_of_context from "../../contexts/Chats_user_is_part_of_context";
import group_picture from "../../images/group_chat_picture.jpeg"


interface chat_props {
	chat_id: number,
	userId: string
}

export class chat_card {
	conversation_id: number;
	chat_name: string;
	other_chatters: number [];
	private_chat: boolean;
	// photo: File;

	constructor(chat_name: string, conv_id: number, other_chatters: number []) {
		this.conversation_id = conv_id;
		this.chat_name = chat_name;
		this.other_chatters = other_chatters;
		if (this.other_chatters.length > 1)
			this.private_chat = false;
		else
			this.private_chat = true;
	}
}


const Chat_preview_card = ({chat_id, userId} : chat_props) => {
	const { displayed_chat, setDisplayed_chat } = useMyDisplayedChatContext();
	const handleOnClick = async () => 
	{
		if (displayed_chat.conversation_id != chat_id)
		{
			const response = await fetch(`http://localhost:3003/conversation/getConversationById/${chat_id}`, {
				method: "Get",
				headers: {
					// "Content-Type": "application/json",
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			});
			const conv = await response.json();
			// i have work to do here :)
			// alert("What do here?" + chat_id);
			setDisplayed_chat(conv);
		}
	}
	
	const [photo, setPhoto] = useState("");
	const [conversation_name, setConversation_name] = useState("");
	const [group_chat, set_group_chat] = useState(false);
	useEffect(() => {
			const get_conversation = async (conversation_id : number) => {
				const response = await fetch(`http://localhost:3003/conversation/getConversationById/${conversation_id}`, {
				method: "Get",
				headers: {
					// "Content-Type": "application/json",
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			}) 
			const data = await response.json();
			const participants = data["conversation_participant_arr"];
			set_group_chat(data["group_chat"]);
			if(data["group_chat"] == false)					// its chat between two
			{
				if (Number(userId) == Number(participants[0]))
				{
					await getUserData(participants[1]);
				}
				else
				{
					await getUserData(participants[0]);
				}
			}
			else											// its a group chat
			{
				setPhoto(group_picture);
			}
			setConversation_name(data["conversation_name"])
		}
		const getUserData = async (other_user_id : number) => {
			const response = await fetch(`http://localhost:3003/pictures/${other_user_id}`, {
				method: "Get",
				headers: {
					// "Content-Type": "application/json",
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			}) 
			const path = await response.blob();
			const url = URL.createObjectURL(path);
			setPhoto(url);
		}
		get_conversation(chat_id);
		}, []);

	return (
		<li className='Chat_preview_cards' title={conversation_name} onClick={handleOnClick}>
			<img src={photo} alt="" />
			<span id='user-name' >{conversation_name}</span>
		</li>
	)
}

const Get_all_my_chats = ({userId, my_chats_ids, setmy_chats_ids} : { userId: string, my_chats_ids: number[], setmy_chats_ids:any}) =>
{
	useEffect(() => {
		async function get_ids(){
			const response = await fetch("http://localhost:3003/conversation/GetMyChats", {
				method: "Get",
				headers: {
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			})
			if (response.ok) {
				const data : number[] = await response.json();
				setmy_chats_ids(data);
			}
		}
		get_ids();
	  }, []);
	return (
		<div className="left-pane-column" >
			<h2>My Chats</h2>
			<ul className='list-cards' >
				{
					my_chats_ids.map((chat_id, idx) => (
						<Chat_preview_card key={idx} chat_id={chat_id} userId={userId} />
					))
				}	
			</ul>
		</div>
	)
	
}

export default Get_all_my_chats