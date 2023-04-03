import { useContext, useEffect } from "react"
import JSCookies from "js-cookie";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import { Serv_context } from "../../contexts/Server_host_context.";

// kick, mute, ban, make admin
type administraion_props =
{
	user_id: number;
	setmuted: React.Dispatch<React.SetStateAction<boolean>>;
	setadmin: React.Dispatch<React.SetStateAction<boolean>>;
	setowner: React.Dispatch<React.SetStateAction<boolean>>;
	set_user_ids_in_chat_details: React.Dispatch<React.SetStateAction<number[]>>;
}

	// "conversation_owner_arr":[322]
	// "conversation_admin_arr":[322,98455]
	// "conversation_black_list_arr":[]
	// "conversation_mute_list_arr":[]
	
	
	
	
	// (':conversation_id/setKick/:id_to_kick')
	// (':conversation_id/setBan/:id_to_ban')

const Popup_chat_administration = ({user_id, setmuted, setadmin, setowner, set_user_ids_in_chat_details} : administraion_props) =>
{
	const { displayed_chat } = useMyDisplayedChatContext();
	 const serv_ip : string = process.env.REACT_APP_Server_host_ip ?? 'localhost';
	const handle_kick = async (user_id: number, is_banned_click: boolean) =>
	{
		console.log(" called handle_kick or ban ");

		if(is_banned_click)
		{
			try
			{
				const respone = await fetch(`http://${serv_ip}:3003/conversation/${displayed_chat.conversation_id}/setBan/${user_id}`,{
				method: "PUT",
					headers: {
						// "Content-Type": "application/json",
						Authorization: `Bearer ${JSCookies.get("accessToken")}`,
					},
				});
				const conv = await respone.json();
				const participants : number []= conv["conversation_participant_arr"];
				if(!participants.includes(user_id))					// kick was successfull
				{
					const idx = displayed_chat.conversation_participant_arr.indexOf(user_id);
					displayed_chat.conversation_participant_arr.splice(idx, 1);
					displayed_chat.conversation_black_list_arr?.push(user_id);
					if (displayed_chat.conversation_mute_list_arr?.includes(user_id))
					{
						const idx_m = displayed_chat.conversation_mute_list_arr.indexOf(user_id);
						displayed_chat.conversation_mute_list_arr.splice(idx_m, 1);
					}
					if (displayed_chat.conversation_admin_arr?.includes(user_id))
					{
						const idx_a = displayed_chat.conversation_admin_arr.indexOf(user_id);
						displayed_chat.conversation_admin_arr.splice(idx_a, 1);
					}
					set_user_ids_in_chat_details([...participants]);
				}
			}
			catch(error)
			{
			}
		}
		else
		{
			try
			{
				const respone = await fetch(`http://${serv_ip}:3003/conversation/${displayed_chat.conversation_id}/setKick/${user_id}`,{
				method: "PUT",
					headers: {
						// "Content-Type": "application/json",
						Authorization: `Bearer ${JSCookies.get("accessToken")}`,
					},
				});
				const conv = await respone.json();
				const participants : number []= conv["conversation_participant_arr"];
				if(!participants.includes(user_id))					// kick was successfull
				{
					const idx = displayed_chat.conversation_participant_arr.indexOf(user_id);
					displayed_chat.conversation_participant_arr.splice(idx, 1);
					if (displayed_chat.conversation_mute_list_arr?.includes(user_id))
					{
						const idx_m = displayed_chat.conversation_mute_list_arr.indexOf(user_id);
						displayed_chat.conversation_mute_list_arr.splice(idx_m, 1);
					}
					if (displayed_chat.conversation_admin_arr?.includes(user_id))
					{
						const idx_a = displayed_chat.conversation_admin_arr.indexOf(user_id);
						displayed_chat.conversation_admin_arr.splice(idx_a, 1);
					}
					set_user_ids_in_chat_details([...participants]);
				}
			}
			catch(error)
			{
			}
		}
	}
	const handle_mute = async (user_id: number) =>
	{
		// :conversation_id/setMute/:id_to_mute
		try
		{
			const respone = await fetch(`http://${serv_ip}:3003/conversation/${displayed_chat.conversation_id}/setMute/${user_id}`,{
			method: "PUT",
				headers: {
					// "Content-Type": "application/json",
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			});
			const conv = await respone.json();
			const admin_arr : number []= conv["conversation_mute_list_arr"];
			if(admin_arr.includes(user_id))
			{
				displayed_chat.conversation_mute_list_arr?.push();
				setmuted(true);
			}
		}
		catch(error)
		{
		}
	}
	const handle_make_admin = async (user_id: number) =>
	{
		try
		{
			const respone = await fetch(`http://${serv_ip}:3003/conversation/${displayed_chat.conversation_id}/setAdmin/${user_id}`,{
			method: "PUT",
				headers: {
					// "Content-Type": "application/json",
					Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			});
			const conv = await respone.json();
			const admin_arr : number []= conv["conversation_admin_arr"];
			if(admin_arr.includes(user_id))
			{
				displayed_chat.conversation_admin_arr?.push();
				setadmin(true);
			}
		}
		catch(error)
		{
		}
	}

	// "conversation_owner_arr":[322]
	// "conversation_admin_arr":[322,98455]
	// "conversation_black_list_arr":[]
	// "conversation_mute_list_arr":[]

	return (
		<div id="admin-buttons">
			<button className="purple-button" onClick={() => handle_kick(user_id, false)}>KICK</button>
			<button className="purple-button" onClick={() => handle_mute(user_id)}>MUTE</button>
			<button className="purple-button" onClick={() => handle_kick(user_id, true)}>BAN</button>
			<button className="purple-button" onClick={() => handle_make_admin(user_id)}>MAKE ADMIN</button>
		</div>
	)
}

export default Popup_chat_administration