import { ReactNode } from "react";

export interface ContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  getToken: () => string | null;
  resetToken: () => void;
}

export interface ContextProviderProps {
  children: ReactNode;
}