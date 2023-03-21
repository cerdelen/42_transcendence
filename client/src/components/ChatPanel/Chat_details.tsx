import { useContext } from "react";
import { useMyDisplayedChatContext } from "../../contexts/Displayed_Chat_Context";
import { UserContext } from "../../contexts/UserContext";
import { our_socket } from "../../utils/context/SocketContext";




// const handleLeaveChat = () =>
const handleLeaveChat = (chat_id: number, setDisplayed_chat: React.Dispatch<React.SetStateAction<number>>, userId:string) =>
{

	console.log("handleLeaveChat ");
	
	our_socket.emit('leave_group_chat', {chat_id: chat_id, userId: userId});
	// setDisplayed_chat(-1);
	// alert("this is an alert");
}


const	Chat_details = () =>
{
	const { displayed_chat, setDisplayed_chat } = useMyDisplayedChatContext();
	const { userId } = useContext(UserContext);

	return (
		<div className="Chat_details">
			<div className="Chat_name_for_chat_details">Chat Name</div>
			<ul className="User_list_in_chat_detals">
				<li className="User_for_list_in_chat_details">User 1</li>
				<li className="User_for_list_in_chat_details">User 2</li>
				<li className="User_for_list_in_chat_details">User 3</li>
				<li className="User_for_list_in_chat_details">User 4</li>
				<li className="User_for_list_in_chat_details">User 5</li>
				<li className="User_for_list_in_chat_details">User 6</li>
				<li className="User_for_list_in_chat_details">User 7</li>
				<li className="User_for_list_in_chat_details">User 8</li>
				<li className="User_for_list_in_chat_details">User 9</li>
				<li className="User_for_list_in_chat_details">User 10</li>
				{/* Add more users as needed */}
			</ul>
			<button onClick={() => handleLeaveChat(displayed_chat, setDisplayed_chat, userId)}>Leave Chat</button>
			{/* <button onClick={handleLeaveChat}>Leave Chat</button> */}
		</div>


	)
}

export default Chat_details