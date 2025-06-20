import { createContext } from "react";
import type { AuthState } from "@/lib/auth-utils";

export const AuthContext = createContext<AuthState | undefined>(undefined);
