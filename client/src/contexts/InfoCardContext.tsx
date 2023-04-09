import React, { useContext, useState } from "react";
import { createContext } from "react";
import Bulgaria from "../images/bulgaria.jpeg";
import Paris from "../images/paris.jpeg";
import Cat_valley from "../images/Cat_valley.jpeg";

type MyContextType = {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showUserInfo: boolean;
  setShowUserInto: React.Dispatch<React.SetStateAction<boolean>>;
  userIdCard: string;
  setUserIdCard: React.Dispatch<React.SetStateAction<string>>;
  images: any[];
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
  images: []
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
  let images: any[] = [];
  let pic = new Image();
  pic.src = Bulgaria;
  let pic1 = new Image();
  pic1.src = Paris;
  let pic2 = new Image();
  pic2.src = Cat_valley;
  let pic_: any[] = [...images];
  pic_.push(pic);
  pic_.push(pic1);
  pic_.push(pic2);
  images = [...pic_];
  const value = {
    showUserInfo,
    setShowUserInto,
    userIdCard,
    setUserIdCard,
    isDropdownOpen,
    setIsDropdownOpen,
    showMenu,
    setShowMenu,
    images,
  };

  return (
    <InfoCardContext.Provider value={value}>
      {children}
    </InfoCardContext.Provider>
  );
}

export default InfoCardProvider;
