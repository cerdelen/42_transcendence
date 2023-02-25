import React, { createContext, useContext, PropsWithChildren } from 'react';

interface MyContextType {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

const MyContext = createContext<MyContextType>({
  loggedIn: false,
  setLoggedIn: () => {},
});

export const MyProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [loggedIn, setLoggedIn] = React.useState(false);

  return (
    <MyContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
