// context/LoadingBarContext.js
import React, { createContext, useState } from 'react';

export const LoadingBarContext = createContext();

export const LoadingBarProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);

  return (
    <LoadingBarContext.Provider value={{ progress, setProgress }}>
      {children}
    </LoadingBarContext.Provider>
  );
};
