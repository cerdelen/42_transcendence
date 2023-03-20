import React, { useContext, useState } from "react";
import { createContext } from "react";

type MyContextType = {
	not_joined_chats_ids: number[];
	setNot_joined_chats_ids: React.Dispatch<React.SetStateAction<Array<number>>>;
};

const Not_joined_group_chats_context = createContext<MyContextType>({
    not_joined_chats_ids: [],
	setNot_joined_chats_ids: () => {},
});

export const useMyNot_joined_group_chats_context = () => useContext(Not_joined_group_chats_context);

type MyContextProviderProps = {
  children: React.ReactNode;
};

export function Not_joined_group_chatsProvider({ children }: MyContextProviderProps) {
	const [not_joined_chats_ids, setNot_joined_chats_ids] = useState<Array<number>>([]);

	const value = {
		not_joined_chats_ids,
		setNot_joined_chats_ids,
	};

  return (
    <Not_joined_group_chats_context.Provider value={value}>
      {children}
    </Not_joined_group_chats_context.Provider>
  );
}

export default Not_joined_group_chats_context;



// const [not_joined_chats_ids, setNot_joined_chats_ids] = useState<Array<number>>([]);