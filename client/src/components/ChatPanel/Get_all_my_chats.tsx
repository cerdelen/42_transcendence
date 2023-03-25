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
	// console.log('called chat preview window');
	// console.log(chat_id);

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
			// console.log("in get user data id = " + other_user_id);
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
			// const response_two = await fetch("http://localhost:3003/user/user_name", {
			// 	method: "Post",
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		'Accept': 'application/json',
			// 	  Authorization: `Bearer ${JSCookies.get("accessToken")}`,
			// 	},
			// 	body: JSON.stringify({ user_id: other_user_id }),
			//   });
			// const data = await response_two.text();
			// setConversation_name(data);
		}
		// const get_default_group_chat_picture = async () => {
		// 	const response = await fetch(`http://localhost:3003/pictures/group_chat`, {
		// 		method: "Get",
		// 		headers: {
		// 			// "Content-Type": "application/json",
		// 			Authorization: `Bearer ${JSCookies.get("accessToken")}`,
		// 		},
		// 	}) 
		// 	const path = await response.blob();
		// 	const url = URL.createObjectURL(path);
		// 	setPhoto(url);
		// }
		get_conversation(chat_id);
		// if(group_chat == false)
		}, []);

	return (
		<li className='Chat_preview_cards'onClick={handleOnClick}>
			<div className='player-availability'>
				<img src={photo} alt="" />
				<span id='user-name' title={"chat_name"} >{conversation_name}</span>
			</div>
		</li>
	)
}

const Get_all_my_chats = ({userId, my_chats_ids, setmy_chats_ids} : { userId: string, my_chats_ids: number[], setmy_chats_ids:any}) =>
{
	// const { setmy_chats_ids } = useContext(Chats_user_is_part_of_context)
	console.log("Get_all_my_chats is rendered");
	useEffect(() => {
		async function get_ids(){
			const response = await fetch("http://localhost:3003/conversation/GetMyChats", {
				method: "Get",
				headers: {
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			})
			if (response.ok)
			{
				const data : number[] = await response.json();
				console.log("response from getmychats fetch " + JSON.stringify(data));
				
				setmy_chats_ids(data);
			}
		}
		get_ids();
	  }, []);
	return (
		<>
			<h2>My Chats</h2>
			<ul className='game-page-games-online-ul'>
				{/* <img src={photo} alt="" /> */}
				<div className='player-availability'>
					<div>smth inside</div>
					{
						my_chats_ids.map((chat_id, idx) => (
							<Chat_preview_card key={idx} chat_id={chat_id} userId={userId} />
						))}	
				</div>
			</ul>
		</>
	)
	
}

export default Get_all_my_chats