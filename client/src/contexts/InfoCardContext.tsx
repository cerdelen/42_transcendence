import React, { useContext, useState } from "react";
import { createContext } from "react";

type MyContextType = {
    showUserInfo: boolean;
    setShowUserInto: React.Dispatch<React.SetStateAction<boolean>>;
    userIdCard: string;
    setUserIdCard: React.Dispatch<React.SetStateAction<string>>;
};

const InfoCardContext = createContext<MyContextType>({
    showUserInfo: false,
    setShowUserInto: () => {},
    userIdCard: '',
    setUserIdCard: () => {},
});

export const useMyContext = () => useContext(InfoCardContext);

type MyContextProviderProps = {
  children: React.ReactNode;
};

export function InfoCardProvider({ children }: MyContextProviderProps) {
  const [showUserInfo, setShowUserInto] = useState(false);
  const [userIdCard, setUserIdCard] = useState('');

  const value = {
    showUserInfo,
    setShowUserInto,
    userIdCard,
    setUserIdCard,
  };

  return (
    <InfoCardContext.Provider value={value}>
      {children}
    </InfoCardContext.Provider>
  );
}

export default InfoCardProvider;
