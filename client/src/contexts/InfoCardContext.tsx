import React, { useContext, useState } from "react";
import { createContext } from "react";

type MyContextType = {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showUserInfo: boolean;
  setShowUserInto: React.Dispatch<React.SetStateAction<boolean>>;
  userIdCard: string;
  setUserIdCard: React.Dispatch<React.SetStateAction<string>>;
};

const InfoCardContext = createContext<MyContextType>({
  showUserInfo: false,
  setShowUserInto: () => {},
  showMenu: false,
  setShowMenu: () => {},
  isDropdownOpen: false,
  setIsDropdownOpen: () => {},
  userIdCard: "",
  setUserIdCard: () => {},
});

export const useMyContext = () => useContext(InfoCardContext);

type MyContextProviderProps = {
  children: React.ReactNode;
};

export function InfoCardProvider({ children }: MyContextProviderProps) {
  const [showUserInfo, setShowUserInto] = useState(false);
  const [userIdCard, setUserIdCard] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const value = {
    showUserInfo,
    setShowUserInto,
    userIdCard,
    setUserIdCard,
    isDropdownOpen,
    setIsDropdownOpen,
    showMenu,
    setShowMenu,
  };

  return (
    <InfoCardContext.Provider value={value}>
      {children}
    </InfoCardContext.Provider>
  );
}

export default InfoCardProvider;
