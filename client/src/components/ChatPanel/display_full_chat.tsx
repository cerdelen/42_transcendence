import {useContext, useEffect, useState} from 'react';
import { UserContext } from "../../contexts/UserContext"
import JSCookies from "js-cookie";
import { our_socket } from '../../utils/context/SocketContext';

interface typing
{
	name: string,
	isTyping: boolean,
}

class display_message_info {
	text: string;
	author_id: number;
  
	constructor(_text: string, _author_id: number)
	{
	  this.text = _text;
	  this.author_id = _author_id;
	}
  }

function DisplayTyping({typingDisplay} : {typingDisplay: string})
{
  return <>
  {typingDisplay}
  </>
}

const Display_message_in_chat = ({ message }: { message: display_message_info }) =>
{
	const { userId } = useContext(UserContext);
	const is_me : boolean = (message.author_id == Number(userId));
	// console.log("this is isme " + is_me);
	
  
	return (
	  <>
		<div className={is_me ? 'right_message' : 'left_message'}>
		  <div>{message.author_id}</div>
		  <div>{message.text}</div>
		</div>
	  </>
	);
  }
  
  function Display_full_chat({chat_id} : {chat_id : number})
  {
	const [typingDisplay, setTypingDisplay] = useState('');
	const [messages, set_messages] = useState<Array<display_message_info>>([]);

	console.log("called display messages()");
	useEffect(() => {
		our_socket.on('typing', (typing: typing) =>
		{
			if(typing.isTyping)
			{
				setTypingDisplay(`${typing.name} is typing ...`);
			}else{
				setTypingDisplay("");
			}
		})
	  const get_messages = async(chat_id: number) =>
	  {
		console.log("this is the get_nessages() this means i will be running a fetch");
		if(chat_id == -1)
		{
		  console.log("chat_id == -1 cleaning messages");
		  const messages : display_message_info[] = [];
		  set_messages(messages)
		  return ;
		}
		const response = await fetch(`http://localhost:3003/conversation/get_messages_from_conversation/${chat_id}`, {
				  method: "Get",
				  headers: {
					  Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				  },
			  })
		const data : [] = await response.json();
		let messages : display_message_info[] = [];
		if (data.length == 0)
		{
		  set_messages(messages);
		  return ;
		}
		// console.log("this is the data i got " + await JSON.stringify(data));
		
			  for(let i = 0; i < data.length; i++)
		{
		  messages.push(new display_message_info(data[i]["text"], data[i]["author"]));
		}
		set_messages(messages);
	  } 
	  get_messages(chat_id);
	}, [chat_id]);
  
	console.log("this is the messages"  + JSON.stringify(messages));
	return (
	  <>
		{messages.map((message, idx) => (
		  <Display_message_in_chat key={idx} message={message}/>
		))}
		<DisplayTyping typingDisplay={typingDisplay} />

	  </>
	)
	// return <>{users.map((user : message) => (<li> {"["}{user.name}{"]"} {"\t"} {user.text} </li>))}</>;
}

export default Display_full_chat