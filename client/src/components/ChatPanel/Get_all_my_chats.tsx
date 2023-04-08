import { useState, useEffect, useContext } from "react";
import JSCookies from "js-cookie";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import group_picture from "../../images/group_chat_picture.jpeg"
import { our_socket } from "../../utils/context/SocketContext";
import { displayed_chat_class } from "../../utils/types";
import { useMyChatCardsContext } from "../../contexts/chatCardsContext";
import { UserContext, useUserContext } from "../../contexts/UserContext";
import { useMyContext } from "../../contexts/InfoCardContext";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";
import ipAddress from '../../constants';

interface chat_props {
	chat_id: number,
	myUserId: string
}

export class chat_card {
	conversation_id: number;
	chat_name: string;
	other_chatters: number [];
	private_chat: boolean;

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


const Chat_preview_card = ({chat_id, myUserId} : chat_props) => {
	const { displayed_chat, setDisplayed_chat } = useMyDisplayedChatContext();
	const { picture_map, set_picture_map, pushPictureToMap } = useMyProfile_picture_Context();
	const handleOnClick = async () => 
	{
		if (displayed_chat.conversation_id != chat_id)
		{
			const response = await fetch(`http://${ipAddress}:3003/conversation/getConversationById/${chat_id}`, {
				method: "Get",
				headers: {
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			});
			const conv = await response.json();
			setDisplayed_chat(conv);
		}
	}
	
	const [photo, setPhoto] = useState("");
	const [conversation_name, setConversation_name] = useState("");
	const [group_chat, set_group_chat] = useState(false);
	useEffect(() => {
			const get_conversation = async (conversation_id : number) => {
				const response = await fetch(`http://${ipAddress}:3003/conversation/getConversationById/${conversation_id}`, {
				method: "Get",
				headers: {
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			}) 
			const data = await response.json();
			const participants = data["conversation_participant_arr"];
			set_group_chat(data["group_chat"]);
			if(data["group_chat"] == false)					// its chat between two
			{
				if (Number(myUserId) == Number(participants[0]))
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
		const getUserData = async (other_user_id : number) =>
		{
			
			if(picture_map.has(Number(other_user_id)))
			{
				console.log("already included");
				setPhoto(picture_map.get(Number(other_user_id)) ?? '');
				return ;
			}
			console.log("was NOT already included");
			setPhoto(await pushPictureToMap(Number(other_user_id), picture_map, set_picture_map));
		}
		if (picture_map != undefined)
			get_conversation(chat_id);
		}, [picture_map]);
		
	return (
		<li className='chatPreviewCards' title={conversation_name} onClick={handleOnClick}>
			<img src={photo} alt="" />
			<span id='user-name' >{conversation_name}</span>
		</li>
	)
}

const Get_all_my_chats = () =>
{
	const { displayed_chat, setDisplayed_chat } = useMyDisplayedChatContext();
	const {my_chats_ids, setmy_chats_ids} =  useMyChatCardsContext();
	const { myUserId } = useUserContext();
	const [ reset_displayed_chat, set_reset_displayed_chat] = useState(displayed_chat.conversation_id);
	const { setShowUserInto } = useMyContext();
	useEffect(() => {
		async function get_ids(){
			const response = await fetch(`http://${ipAddress}:3003/conversation/GetMyChats`, {
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
	useEffect(() => {
		const set_new_displayed_chat = async () =>
		{
			try {
				if (reset_displayed_chat !== -1){
					const response = await fetch(`http://${ipAddress}:3003/conversation/getConversationById/${reset_displayed_chat}`, {
						method: "Get",
						headers: {
							Authorization: `Bearer ${JSCookies.get("accessToken")}`,
						},
					});
					const conv = await response.json();
					setDisplayed_chat(conv);
				}
			} catch (error) {
				console.log(error);	
			}
		}
		set_new_displayed_chat();
	}, [reset_displayed_chat]);

		our_socket.on("new_dialogue_created", ({userid_creator, other_user, chat_id} : {userid_creator: number, other_user: number, chat_id: number}) =>
		{	
			if (userid_creator == Number(myUserId))
			{
				setmy_chats_ids([...my_chats_ids, chat_id]);
				set_reset_displayed_chat(chat_id);
				setShowUserInto(false);
			}
			else if (other_user == Number(myUserId))
			{
				setmy_chats_ids([...my_chats_ids, chat_id]);
			}
		});

		our_socket.on("some_one_left_group_chat", ({conv_id, left_user_id, conv_still_exists} : {conv_id: number, left_user_id: number, conv_still_exists: boolean}) =>
		{
			if (left_user_id == Number(myUserId))
			{
				const default_chat : displayed_chat_class = { conversation_id: -1, conversation_participant_arr: []}
				setDisplayed_chat(default_chat);
				const conv_indx = my_chats_ids.indexOf(conv_id);
				if (conv_indx !== -1)
				{
					my_chats_ids.splice(conv_indx, 1);
					setmy_chats_ids([...my_chats_ids]);
				}
				
			}
		});
		
	return (
		<div className="left-pane-column" >
			<h2>My Chats</h2>
			<ul className='list-cards' >
				{
					my_chats_ids.map((chat_id) => (
						<Chat_preview_card key={chat_id} chat_id={chat_id} myUserId={myUserId} />
					))
				}	
			</ul>
		</div>
	)
	
}

export default Get_all_my_chats