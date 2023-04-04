import React, { createContext, ReactNode, useCallback, useState } from 'react';

interface CounterContextType {
    mapNumber: number;
    setMapNumber: React.Dispatch<React.SetStateAction<number>>;
}

export const CounterContext = createContext<CounterContextType>({
  mapNumber: 0,
  setMapNumber: () => {}
});
interface Props {
    children: any;
}
export const CounterProvider: React.FC<Props> = ({children}) => {
  const [mapNumber, setMapNumber] = useState<number>(0);
console.log("Siemanko ");
  return (
    <CounterContext.Provider value={{ mapNumber, setMapNumber }}>
      {children}
    </CounterContext.Provider>
  );
};


