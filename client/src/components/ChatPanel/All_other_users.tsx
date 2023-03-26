import { useState, useEffect } from "react";
import JSCookies from "js-cookie";
import { useMyContext } from "../../contexts/InfoCardContext";

const User_preview_card = ({other_user_id} : {other_user_id: number}) => {
	const { setUserIdCard, setShowUserInto} = useMyContext();

	const handleOnClick = () => 
	{
		setUserIdCard(other_user_id.toString());
		setShowUserInto(true);
	}
	
	const [photo, setPhoto] = useState("");
	const [user_name, set_user_name] = useState("");
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
		}
		get_user_info(other_user_id);
		}, []);

	return (
		<li className='Chat_preview_cards'  title={user_name} onClick={handleOnClick}>
			<img src={photo} alt="" />
			<span id='user-name' >{user_name}</span>
		</li>
	)
}



const Get_all_other_users = () =>
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
				set_other_users_id(data);
			}
		}
		get_all_user_ids();
	  }, []);
	return (
		<div className="left-pane-column" >
			<h2>Other Users</h2>
			<ul className='list-cards'>
				{
					other_users_ids.map((other_user_id, idx) => (
						<User_preview_card key={idx} other_user_id={other_user_id} />
					))
				}	
			</ul>
		</div>
	)
}

export default Get_all_other_users