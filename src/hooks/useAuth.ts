/**
 * useAuth hook - Simple interface to auth context
 */

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import type { AuthContextValue } from "@/contexts/AuthProvider";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
