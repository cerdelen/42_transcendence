import Community_left_collumn from '../ChatPanel/Community_left_collumn'
import Open_group_cards from '../ChatPanel/open_group_chats_bar';
import Chat_area from '../ChatPanel/chat_area';
import ChatCardsContextProvider from "../../contexts/chatCardsContext";

const Community = () => {

  return (
    <ChatCardsContextProvider>
      <div id='community'>
        <Community_left_collumn />
        <Chat_area />
        <Open_group_cards />
      </div>
    </ChatCardsContextProvider>
  )
}

export default Community