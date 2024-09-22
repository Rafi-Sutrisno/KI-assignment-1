"use client";

import { createContext, useState } from "react";
import { ContextType } from "@/interface/token";
import { ContextProviderProps } from "@/interface/token";

export const Context = createContext<ContextType | undefined>(undefined);

const TokenContextProvider: React.FC<ContextProviderProps> = (props) => {
  const [token, setToken] = useState<string | null>(null);

  const getToken = () => {
    return token;
  };

  const resetToken = () => {
    setToken(null);
  };

  const contextValue = {
    token,
    setToken,
    getToken,
    resetToken,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default TokenContextProvider;
