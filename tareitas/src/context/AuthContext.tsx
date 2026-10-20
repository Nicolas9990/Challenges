import { createContext, useContext, type ReactNode } from "react";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: unknown }>;
  register: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: unknown }>;
  logout: () => Promise<{ success: boolean; error?: unknown }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
