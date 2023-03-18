import React, { useContext, useState } from "react";
import { createContext } from "react";

type MyContextType = {
    showUserInfo: boolean;
    setShowUserInto: React.Dispatch<React.SetStateAction<boolean>>;
};

const InfoCardContext = createContext<MyContextType>({
    showUserInfo: false,
    setShowUserInto: () => {},
});

export const useMyContext = () => useContext(InfoCardContext);

type MyContextProviderProps = {
  children: React.ReactNode;
};

export function InfoCardProvider({ children }: MyContextProviderProps) {
  const [showUserInfo, setShowUserInto] = useState(false);

  const value = {
    showUserInfo,
    setShowUserInto,
  };

  return (
    <InfoCardContext.Provider value={value}>
      {children}
    </InfoCardContext.Provider>
  );
}

export default InfoCardProvider;
