import { useContext } from "react";
import type { AuthState } from "@/lib/auth-utils";
import { AuthContext } from "@/contexts/auth-context";

export function useAuthContext(): AuthState {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
