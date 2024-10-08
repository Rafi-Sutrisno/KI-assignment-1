"use client";

import { createContext, useState } from "react";
import { ContextType } from "@/interface/token";
import { ContextProviderProps } from "@/interface/token";

export const Context = createContext<ContextType | undefined>(undefined);

const TokenContextProvider: React.FC<ContextProviderProps> = (props) => {
  // Initialize token state from localStorage only if it's available
  const initialToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [token, setToken] = useState<string | null>(initialToken);

  const saveToken = (newToken: string) => {
    setToken(newToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", newToken); // Save token to local storage
    }
  };

  const getToken = () => {
    return token; // Return the current token state
  };

  const resetToken = () => {
    console.log("masuk resettoken");
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token"); // Remove token from local storage
    }
  };

  const contextValue = {
    token,
    setToken: saveToken,
    getToken,
    resetToken,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default TokenContextProvider;
