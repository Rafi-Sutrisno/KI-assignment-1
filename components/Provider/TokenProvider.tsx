"use client";

import { createContext, useState, useEffect } from "react";
import { ContextType } from "@/interface/token";
import { ContextProviderProps } from "@/interface/token";

export const Context = createContext<ContextType | undefined>(undefined);

const TokenContextProvider: React.FC<ContextProviderProps> = (props) => {
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false); // Track if component has mounted

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken); // Set the token from localStorage on client mount
    setIsMounted(true); // Indicate that the component has mounted
  }, []);

  const saveToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken); // Save token to local storage
  };

  const getToken = () => {
    return token; // Return the current token state
  };

  const resetToken = () => {
    setToken(null);
    localStorage.removeItem("token"); // Remove token from local storage
  };

  const contextValue = {
    token,
    setToken: saveToken,
    getToken,
    resetToken,
  };

  // Render null until the component is mounted
  if (!isMounted) {
    return null; // Prevent hydration issues
  }

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default TokenContextProvider;
