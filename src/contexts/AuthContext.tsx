import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useAuth();
  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}
