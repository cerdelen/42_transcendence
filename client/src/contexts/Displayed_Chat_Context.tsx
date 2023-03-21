import React, { useContext, useState } from "react";
import { createContext } from "react";

type MyContextType = {
	displayed_chat: number;
	setDisplayed_chat: React.Dispatch<React.SetStateAction<number>>;
};

const Displayed_Chat_Context = createContext<MyContextType>({
  displayed_chat: -1,
	setDisplayed_chat: () => {},
});

export const useMyDisplayedChatContext = () => useContext(Displayed_Chat_Context);

type MyContextProviderProps = {
  children: React.ReactNode;
};

export function Displayed_Chat_Provider({ children }: MyContextProviderProps) {
	const [displayed_chat, setDisplayed_chat] = useState(-1);

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
