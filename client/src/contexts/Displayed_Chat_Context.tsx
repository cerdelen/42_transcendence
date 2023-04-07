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


export function Displayed_Chat_Provider({ children }: MyContextProviderProps)
{
	var default_chat_class : displayed_chat_class = { conversation_id: -1, conversation_participant_arr: []};
	const [displayed_chat, setDisplayed_chat] = useState<displayed_chat_class>(default_chat_class);

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
