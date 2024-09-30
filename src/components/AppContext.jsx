"use client"

import { createContext, useContext, useEffect, useState } from "react";

// Create a context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  // Example state to be shared globally
  const [type, setType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
  console.log(type);
  }, [type])
  

  return (
    <AppContext.Provider
      value={{ type, setType, isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);