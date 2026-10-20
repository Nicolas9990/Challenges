import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export const AuthContext = createContext({
  user: null,
  login: (userData: any) => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, login, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
