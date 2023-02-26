import React, { createContext, useContext, PropsWithChildren } from 'react';

interface MyContextType {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

const MyContext = createContext<MyContextType>({
  loggedIn: false,
  setLoggedIn: () => {},
});


export interface MyProviderProps {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MyProvider: React.FC<PropsWithChildren<MyProviderProps>> = ({ children, loggedIn, setLoggedIn }) => {

  return (
    <MyContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
