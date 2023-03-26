import React, { useContext, useState } from "react";
import { createContext } from "react";

type MyContextType = {
	not_joined_chats_ids: number[];
	setNot_joined_chats_ids: React.Dispatch<React.SetStateAction<Array<number>>>;
	my_chats_ids: number[];
	setmy_chats_ids: React.Dispatch<React.SetStateAction<Array<number>>>;
};

const chatCardsContext = createContext<MyContextType>({
    not_joined_chats_ids: [],
	setNot_joined_chats_ids: () => {},
    my_chats_ids: [],
	setmy_chats_ids: () => {},

});

export const useMyChatCardsContext = () => useContext(chatCardsContext);

type MyContextProviderProps = {
  children: React.ReactNode;
};

export function ChatCardsContextProvider({ children }: MyContextProviderProps) {
	const [not_joined_chats_ids, setNot_joined_chats_ids] = useState<Array<number>>([]);
	const [my_chats_ids, setmy_chats_ids] = useState<Array<number>>([]);

	const value = {
		not_joined_chats_ids,
		setNot_joined_chats_ids,
		my_chats_ids,
		setmy_chats_ids

	};

  return (
    <chatCardsContext.Provider value={value}>
      {children}
    </chatCardsContext.Provider>
  );
}

export default ChatCardsContextProvider;
