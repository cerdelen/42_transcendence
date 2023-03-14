import { MessageContainerStyle,  } from "../utils/styles"
import { MessagesType } from '../utils/types';
import { FC } from "react"; 
import { MessageItemHeaderStyle } from '../utils/styles/index';

type Props = {
	messages: MessagesType[];
}


export const MessageContainer: FC<Props> = ({messages}) => {
	
	
	return (
		<MessageContainerStyle>
			{messages.map(m => (
				
				// <MessageItemHeaderStyle>
				
					console.log(m.text),
				<span className="name">
					{m.author.name}
				</span>
			// </MessageItemHeaderStyle>
			))}
			
		</MessageContainerStyle>
	)
}