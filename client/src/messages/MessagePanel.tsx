import { MessageContainerStyle, MessagePanelStyle } from "../utils/styles"
import { MessageContainer } from "./MessageContainer"
import { MessageInputField } from "./MessageInputField"
import { MessagesType } from '../utils/types';
import { FC } from "react"; 

type Props = {
	messages: MessagesType[];
}

export const MessagePanel: FC<Props> = ({messages}) => {
	return (
		<MessagePanelStyle>
			<MessageContainer messages={messages}/>
			<MessageInputField />

			
		// </MessagePanelStyle>
	)
}