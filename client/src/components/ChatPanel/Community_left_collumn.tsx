import Get_all_my_chats from "./Get_all_my_chats";
import Get_all_other_users from "./All_other_users";


const Community_left_collumn = () => {

	return (
		<div className='community-side-collumn'>
			<Get_all_my_chats />
			<Get_all_other_users />
		</div>
	)
}

export default Community_left_collumn