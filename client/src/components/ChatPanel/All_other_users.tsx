import { useState, useEffect, useContext } from "react";
import JSCookies from "js-cookie";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import { useRevalidator } from "react-router-dom";
import { useMyContext } from "../../contexts/InfoCardContext";
// import Chats_user_is_part_of_context from "../../contexts/Chats_user_is_part_of_context";


interface chat_props {
	chat_id: number,
	userId: string
}


const User_preview_card = ({other_user_id} : {other_user_id: number}) => {
	const { setDisplayed_chat } = useMyDisplayedChatContext();
	// console.log('called chat preview window');
	// console.log(other_user_id);
	const { setUserIdCard, setShowUserInto} = useMyContext();

	const handleOnClick = () => 
	{
		// setDisplayed_chat(chat_id);
		// setUserIdCard()
		console.log(other_user_id);
		// console.log(userIdCard);
		setUserIdCard(other_user_id.toString());
		setShowUserInto(true);
		
		// alert("What do here?");
	}
	
	const [photo, setPhoto] = useState("");
	const [user_name, set_user_name] = useState("");
	// const [group_chat, set_group_chat] = useState(false);
	useEffect(() => {
			const get_user_info = async (other_user_id : number) => {
				const response = await fetch("http://localhost:3003/user/user_name", {
					method: "Post",
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
					},
					body: JSON.stringify({ user_id: other_user_id }),
				});
				const data = await response.text();
				set_user_name(data);
				const response_two = await fetch(`http://localhost:3003/pictures/${other_user_id}`, {
					method: "Get",
					headers: {
						// "Content-Type": "application/json",
						Authorization: `Bearer ${JSCookies.get("accessToken")}`,
					},
				}) 
				const path = await response_two.blob();
				const url = URL.createObjectURL(path);
				setPhoto(url);
			// const data = await response.json();
			// const participants = data["conversation_participant_arr"];
			// // set_group_chat(data["group_chat"]);
			// if(data["group_chat"] == false)					// its chat between two
			// {
			// 	if (Number(userId) == Number(participants[0]))
			// 	{
			// 		await getUserData(participants[1]);
			// 	}
			// 	else
			// 	{
			// 		await getUserData(participants[0]);
			// 	}
			// }
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
		get_user_info(other_user_id);
		// if(group_chat == false)
		}, []);

	return (
		<li className='Chat_preview_cards'onClick={handleOnClick}>
			<div className='player-availability'>
				<img src={photo} alt="" />
				<span id='user-name' title={"chat_name"} >{user_name}</span>
			</div>
		</li>
	)
}



const Get_all_other_users = ({userId, my_chats_ids, setmy_chats_ids} : { userId: string, my_chats_ids: number[], setmy_chats_ids:any}) =>
{
	const [other_users_ids, set_other_users_id] = useState<number[]>([]);

	useEffect(() => {
		async function get_all_user_ids(){
			const response = await fetch("http://localhost:3003/user/get_all_other_user_ids", {
				method: "Get",
				headers: {
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			})
			if (response.ok)
			{
				const data : number[] = await response.json();
				// console.log("response from getmychats fetch " + JSON.stringify(data));
				
				set_other_users_id(data);
			}
		}
		get_all_user_ids();
	  }, []);
	return (
		<>
			<h2>Other Users</h2>
			<ul className='game-page-games-online-ul'>
				{/* <img src={photo} alt="" /> */}
				<div className='player-availability'>
					<div>smth inside</div>
					{
						other_users_ids.map((other_user_id, idx) => (
							<User_preview_card key={idx} other_user_id={other_user_id} />
						))}	
				</div>
			</ul>
		</>
	)
	
}

export default Get_all_other_users