import React, { useContext, useState } from "react";
import { createContext } from "react";
import Tochka from "../images/tochka.jpg"
import Bulgaria from "../images/bulgaria.jpeg"
import Paris from "../images/paris.jpeg"
import Cat_valley from "../images/Cat_valley.jpeg"
import { pong_properties } from "../components/Pong_types";

type MyContextType = {
    showUserInfo: boolean;
    setShowUserInto: React.Dispatch<React.SetStateAction<boolean>>;
    userIdCard: string;
    setUserIdCard: React.Dispatch<React.SetStateAction<string>>;
    // isInvited: boolean;
    // setIsInvited: React.Dispatch<React.SetStateAction<boolean>>;
    images: any[];
    initial_state: pong_properties;
};

const InfoCardContext = createContext<MyContextType>({
    showUserInfo: false,
    setShowUserInto: () => {},
    userIdCard: '',
    setUserIdCard: () => {},
    // isInvited: false,
    // setIsInvited: () => {},
    images: [],
    initial_state: { keysPressed: [],
      player_1_score: 0,
      player_2_score: 0,
      Ball: {
          speed: 5,
          x: 700 / 2 - 10 / 2,
          y: 400 / 2 - 10 / 2,
          width: 50,
          height: 50,
          xVel: 1,
          yVel: 1,
          direction: 0,
      },
      Player1: {
          speed: 10,
          x: 20,
          y: 400 / 2 - 60 / 2,
          width: 20,
          height: 60,
          xVel: 0,
          yVel: 0,
      },
      Player2: {
          speed: 10,
          x: 700 - (20 + 20),
          y: 400 / 2 - 60 / 2,
          width: 20,
          height: 60,
          xVel: 0,
          yVel: 0,
      }}
  });

export const useMyContext = () => useContext(InfoCardContext);

type MyContextProviderProps = {
  children: React.ReactNode;
};

export function InfoCardProvider({ children }: MyContextProviderProps) {
  const [showUserInfo, setShowUserInto] = useState(false);
  const [userIdCard, setUserIdCard] = useState('');
  // const [isInvited, setIsInvited] = useState(false);

  let images : any[] = [];
  let pic = new Image();
  pic.src = Bulgaria
  let pic1 = new Image();
  pic1.src = Paris;
  let pic2 = new Image();
  pic2.src = Cat_valley;
  let initial_state = { keysPressed: [],
    player_1_score: 0,
    player_2_score: 0,
    Ball: {
        speed: 5,
        x: 700 / 2 - 10 / 2,
        y: 400 / 2 - 10 / 2,
        width: 50,
        height: 50,
        xVel: 1,
        yVel: 1,
        direction: 0,
    },
    Player1: {
        speed: 10,
        x: 20,
        y: 400 / 2 - 60 / 2,
        width: 20,
        height: 60,
        xVel: 0,
        yVel: 0,
    },
    Player2: {
        speed: 10,
        x: 700 - (20 + 20),
        y: 400 / 2 - 60 / 2,
        width: 20,
        height: 60,
        xVel: 0,
        yVel: 0,
}};
  let pic_ : any[] = [...images];
  pic_.push(pic);
  pic_.push(pic1);
  pic_.push(pic2);
  images = [...pic_]
  const value = {
    showUserInfo,
    setShowUserInto,
    userIdCard,
    setUserIdCard,
    images,
    initial_state,
  //  isInvited,
  //  setIsInvited,

  };

  return (
    <InfoCardContext.Provider value={value}>
      {children}
    </InfoCardContext.Provider>
  );
}

export default InfoCardProvider;
