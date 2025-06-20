import { createContext } from "react";
import type { AuthState } from "@/lib/spotify-client";

export const AuthContext = createContext<AuthState | undefined>(undefined);
