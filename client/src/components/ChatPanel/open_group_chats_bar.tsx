import { useContext, useState, useEffect } from "react"
import { UserContext } from "../../contexts/UserContext"
import JSCookies from "js-cookie";
import group_picture from "../../images/group_chat_picture.jpeg"
import Chat_details from "./Chat_details";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";

interface chat_props {
	chat_id: number,
	onTestChange: any,
}

// const handleCreateGroupChat = async (my_chats_ids: number[], setmy_chats_ids:any, userId: string)	=>
const Chat_name_input = ({not_joined_chats_ids, my_chats_ids, setmy_chats_ids, setNot_joined_chats_ids, setButton_state} : { not_joined_chats_ids: number[], my_chats_ids: number[], setmy_chats_ids:any, setNot_joined_chats_ids: any, setButton_state: any}) =>
{
	const [inputValue, setInputValue] = useState('');
	const { setDisplayed_chat } = useMyDisplayedChatContext();
	

	const handleInputChange = (e: any) => {
	setInputValue(e.target.value);
	};

	const handleButtonClick = async () => {
	if(inputValue.length > 0)
	{
			const response = await fetch(`http://localhost:3003/conversation/create_group_chat/${inputValue}`,{
				method: "Get",
				headers: {
					// "Content-Type": "application/json",
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			})
		const data = await response.json();
		console.log(" this is the response of create group chat " + JSON.stringify(data));
		console.log(data["conversation_owner_arr"]);
		setDisplayed_chat(data);
		setButton_state(true);
	}
	else 
	{

		console.log(`Input value: ${inputValue}`);
		console.log(`Input length: ` + inputValue.length);
	}
	};

	return (
	<div className="popup">
		<input type="text" value={inputValue} onChange={handleInputChange} />
		<button onClick={handleButtonClick}>CREATE</button>
	</div>
	);
}

const handleCreateGroupChat = async (setButton_state: any)	=>
{
	// const name: string = "hello";
	console.log("handleCreateGroupChat");

	setButton_state(false);

	// const response = await fetch(`http://localhost:3003/conversation/create_group_chat/${name}`,{
	// 		method: "Get",
	// 		headers: {
	// 			// "Content-Type": "application/json",
	// 			Authorization: `Bearer ${JSCookies.get("accessToken")}`,
	// 		},
	// 	})
	// const data = await response.json();
	// console.log(JSON.stringify( response));
	
}

const Group_chat_preview_card = ({chat_id, not_joined_chats_ids, my_chats_ids, setmy_chats_ids, setNot_joined_chats_ids} : { chat_id: number, not_joined_chats_ids: number[], my_chats_ids: number[], setmy_chats_ids:any, setNot_joined_chats_ids: any}) =>
{
	// {not_joined_chats_ids, setmy_chats_ids, setNot_joined_chats_ids} : { chat_id: number, not_joined_chats_ids: number[], setmy_chats_ids:any, setNot_joined_chats_ids: any}
	// console.log('called chat preview window');
	// console.log(chat_id);
	const [photo, setPhoto] = useState("");
	const [conversation_name, setConversation_name] = useState("");
	// const { my_chats_ids } = useContext(Chats_user_is_part_of_context)
	
	const handleOnClick = async () => 
	{
		console.log("handleOnClick of group chat card for chat id " + chat_id);
		const response = await fetch(`http://localhost:3003/conversation/join_group_chat/${chat_id}`, {
				method: "Get",
				headers: {
					// "Content-Type": "application/json",
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			})
		console.log(response);
		// console.log("old array " + my_chats_ids);
		// let new_arr : number [] = my_chats_ids;
		// new_arr.push(chat_id)
		// console.log("new array " + new_arr);
		const data = await response.json();
		console.log(data);
		if (data == true)
		{
			let arr : number [] = []
			for(let i = 0; i < my_chats_ids.length; i++)
			{
				arr.push(my_chats_ids[i]);
			}
			arr.push(chat_id);
			setmy_chats_ids(arr);
			let arr_2 : number [] = []
			for(let i = 0; i < not_joined_chats_ids.length; i++)
			{
				if(chat_id != not_joined_chats_ids[i])
					arr_2.push(not_joined_chats_ids[i]);
			}
			setNot_joined_chats_ids(arr_2);
		}
	}

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
			// console.log("Hellooooooo this is data" + JSON.stringify(data));
			setConversation_name(data["conversation_name"])
			// await get_default_group_chat_picture();
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
		// get_conversation(chat_id);
		}, []);
	// console.log("trying to do this here");
	// console.log(photo);
	// console.log(conversation_name);
	return (
		<li className='Chat_preview_cards'	onClick={handleOnClick}>
			<div className='player-availability'>
				<img src={group_picture} alt="" />
				<span id='user-name' title={"chat_name"} >{conversation_name}</span>
			</div>
		</li>
	)
}

const	Get_all_open_group_chats = ({not_joined_chats_ids, my_chats_ids, setmy_chats_ids, setNot_joined_chats_ids} : { not_joined_chats_ids: number[], my_chats_ids: number[], setmy_chats_ids:any, setNot_joined_chats_ids: any}) =>
{
	console.log("Get_all_open_group_chats is rendered");
	// const { not_joined_chats_ids, setNot_joined_chats_ids } = useContext(Not_joined_group_chats_context);
	// const [not_joined_chats_ids, setNot_joined_chats_ids] = useState<Array<number>>([]);
	useEffect(() => {
		async function get_ids(){
			// const response = await fetch("http://localhost:3003/conversation/GETALLTHEOTHERCHATSIMNOTPARTOF", {
			const response = await fetch("http://localhost:3003/conversation/getAllChatsWithoutUser", {
				method: "Get",
				headers: {
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			})
			if (response.ok)
			{
				const data : number[] = await response.json();
				setNot_joined_chats_ids(data);
			}
		}
		get_ids();
		}, []);

		return (
		<ul className="all_open_group_chats-ul">
			{not_joined_chats_ids.map((chat_id, idx) => (
					<Group_chat_preview_card key={idx} chat_id={chat_id} not_joined_chats_ids={not_joined_chats_ids} my_chats_ids={my_chats_ids} setmy_chats_ids={setmy_chats_ids} setNot_joined_chats_ids={setNot_joined_chats_ids}/>
				))}
		</ul>
		)

}

const	Open_group_cards = ({not_joined_chats_ids, my_chats_ids, setmy_chats_ids, setNot_joined_chats_ids} : { not_joined_chats_ids: number[], my_chats_ids: number[], setmy_chats_ids:any, setNot_joined_chats_ids: any}) => 
{
	console.log("rendering Open_group_cards");
	const [ button_state, setButton_state ] = useState(true);
	const { userId } = useContext(UserContext);
	return (
		<div className='live-games'>
		<h3>JOIN GROUP CHATS</h3>
		<Get_all_open_group_chats not_joined_chats_ids={not_joined_chats_ids} my_chats_ids={my_chats_ids} setmy_chats_ids={setmy_chats_ids} setNot_joined_chats_ids={setNot_joined_chats_ids}/>
		
		{	button_state ? 
				<button onClick={() => handleCreateGroupChat(setButton_state)} >CEATE GROUP CHAT</button>
			:
				< Chat_name_input not_joined_chats_ids={not_joined_chats_ids} my_chats_ids={my_chats_ids} setmy_chats_ids={setmy_chats_ids} setNot_joined_chats_ids={setNot_joined_chats_ids} setButton_state={setButton_state} />
		}
		{/* <button onClick={() => handleCreateGroupChat(my_chats_ids, setmy_chats_ids, userId)} >CEATE GROUP CHAT</button> */}
		
		
		
		<h3>CHAT DETAILS</h3>
		<Chat_details not_joined_chats_ids={not_joined_chats_ids} my_chats_ids={my_chats_ids} setmy_chats_ids={setmy_chats_ids} setNot_joined_chats_ids={setNot_joined_chats_ids}/>
		</div>
	)
}

export default Open_group_cards