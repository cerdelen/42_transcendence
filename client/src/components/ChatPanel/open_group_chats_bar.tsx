import { useContext, useState, useEffect } from "react"
import { UserContext } from "../../contexts/UserContext"
import JSCookies from "js-cookie";
// import { Chat_preview_card } from "./chat_side_bar";

// this is how to use it
// const { userId } =
// useContext(UserContext);

interface chat_props {
	chat_id: number
}

const Group_chat_preview_card = ({chat_id} : chat_props) => {
	// console.log('called chat preview window');
	// console.log(chat_id);
	const [photo, setPhoto] = useState("");
	const [conversation_name, setConversation_name] = useState("");
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
			await get_default_group_chat_picture();
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
		}, []);
	// console.log("trying to do this here");
	// console.log(photo);
	// console.log(conversation_name);
	return (
		<li className='Chat_preview_cards'>
			<div className='player-availability'>
				<img src={photo} alt="" />
				<span id='user-name' title={"chat_name"} >{conversation_name}</span>
			</div>
		</li>
	)
}

const	Get_all_open_group_chats = () =>
{
	const [chat_ids, setchat_ids] = useState<Array<number>>([]);
	useEffect(() => {
		async function get_ids(){
			// const response = await fetch("http://localhost:3003/conversation/GETALLTHEOTHERCHATSIMNOTPARTOF", {
			const response = await fetch("http://localhost:3003/conversation/GetMyChats", {
				method: "Get",
				headers: {
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			})
			if (response.ok)
			{
				const data : number[] = await response.json();
				setchat_ids(data);
			}
		}
		get_ids();
	  }, []);

	  return (
		<ul className="game-page-games-online-ul">
			{chat_ids.map((chat_id, idx) => (
					<Group_chat_preview_card key={idx} chat_id={chat_id} />
				))}
		</ul>
	  )

}

const	Open_group_cards = () => {
	return (
		<Get_all_open_group_chats />
	)
}

export default Open_group_cards