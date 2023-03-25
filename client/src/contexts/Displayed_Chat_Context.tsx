import React, { useContext, useState } from "react";
import { createContext } from "react";
import { displayed_chat_class } from "../utils/types"

type MyContextType = {
	displayed_chat: displayed_chat_class;
	setDisplayed_chat: React.Dispatch<React.SetStateAction<displayed_chat_class>>;
};

const Displayed_Chat_Context = createContext<MyContextType>({
	displayed_chat: { conversation_id: -1, conversation_participant_arr: []},
	setDisplayed_chat: () => {},
});

export const useMyDisplayedChatContext = () => useContext(Displayed_Chat_Context);

type MyContextProviderProps = {
  children: React.ReactNode;
};



// "conversation_id":29
// "conversation_name":"fewf"
// "conversation_is_public":true
// "conversation_pass_protected":false
// "conversation_participant_arr":[98455]
// "conversation_owner_arr":[98455]
// "conversation_admin_arr":[98455]
// "conversation_black_list_arr":[]
// "conversation_mute_list_arr":[]
// "group_chat":false

export function Displayed_Chat_Provider({ children }: MyContextProviderProps)
{
	var default_chat_class : displayed_chat_class = { conversation_id: -1, conversation_participant_arr: []};
	// default_chat_class.id = -1;
	const [displayed_chat, setDisplayed_chat] = useState<displayed_chat_class>(default_chat_class);
	// const [displayed_chat, setDisplayed_chat] = useState(-1);

  const value = {
	displayed_chat,
	setDisplayed_chat,
  };

  return (
    <Displayed_Chat_Context.Provider value={value}>
      {children}
    </Displayed_Chat_Context.Provider>
  );
}

export default Displayed_Chat_Provider;
