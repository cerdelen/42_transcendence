import { useState, useEffect } from "react";
import JSCookies from "js-cookie";

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
	console.log('called chat preview window');
	console.log(chat_id);
	
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
			console.log("Hellooooooo this is data" + JSON.stringify(data));
			set_group_chat(data["group_chat"]);
			
			if(data["group_chat"] == false)					// its chat between two
			{
				if (userId == participants[0])
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
				setConversation_name(data["conversation_name"])
				await get_default_group_chat_picture();
			}

			
			// set_other_chatters(data["conversation_participant_arr"]);
			// setStatusTFA(data["two_FA_enabled"]);
			// const path = await response.blob();
			// const url = URL.createObjectURL(path);
			// setPhoto(url);
		}
		const getUserData = async (user_id : number) => {
			const response = await fetch(`http://localhost:3003/pictures/${user_id}`, {
				method: "Get",
				headers: {
					// "Content-Type": "application/json",
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			}) 
			const path = await response.blob();
			const url = URL.createObjectURL(path);
			setPhoto(url);
			const response_two = await fetch("http://localhost:3003/user/user_data", {
				method: "Post",
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				  Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
				body: JSON.stringify({ user_id: userId }),
			  });
			const data = await response_two.json();
			setConversation_name(data["name"]);
		}
		const get_default_group_chat_picture = async () => {
			const response = await fetch(`http://localhost:3003/pictures/group_chat`, {
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
		// if(group_chat == false)

		
		}, []);
	
	// if(group_chat == true)
	// 	console.log("group chatt == true");
	// else
	// 	console.log("group chatt == false");
	console.log("trying to do this here");
	console.log(photo);
	console.log(conversation_name);
	console.log(group_chat);
	
	
	return (
		<li className='Chat_preview_cards'>
			<div className='player-availability'>
				<img src={photo} alt="" />
				<span id='user-name' title={"chat_name"} >{conversation_name}</span>
			</div>
		</li>
	)
}

const Get_all_my_chats = ({userId} : { userId: string}) =>
{
	const [cards, setchat_card] = useState<Array<chat_card>>([]);
	const [chat_ids, setchat_ids] = useState<Array<number>>([]);
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
				// console.log('response === okay');
				const data : number[] = await response.json();
				setchat_ids(data);
			}
			// const card_array : chat_card [] = [];
			// for(let i = 0; i < chat_ids.length; i++)
			// {
			// 	console.log('pushin smth');
			// 	const smth = new chat_card(chat_ids[i]);
			// 	card_array.push(smth);
			// }
			// setchat_card(card_array);
			// console.log('this is cards at the end of useeffect');
			// console.log(JSON.stringify(cards));
		}
		get_ids();
	  }, []);
	//   console.log("this is chat_ids " + JSON.stringify(chat_ids));
	  
		// console.log('this is cards nefore return');
		// console.log(JSON.stringify(cards));
	return (
		<ul className='game-page-games-online-ul'>
			{/* <img src={photo} alt="" /> */}
			
			<div className='player-availability'>
				<div>smth inside</div>
				{chat_ids.map((chat_id, idx) => (
					<Chat_preview_card key={idx} chat_id={chat_id} userId={userId} />
				))}
			</div>

			</ul>
	)
	
}

const Chat_cards = ({userId} : { userId: string}) => {
	return (
			<Get_all_my_chats userId={userId}/>
	)
}

export default Chat_cards