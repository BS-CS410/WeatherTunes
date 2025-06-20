import { useState, useEffect } from "react";
import { authService } from "@/lib/auth-utils";
import type { AuthState } from "@/lib/auth-utils";

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    authService.checkAuth();
    return unsubscribe;
  }, []);

  return authState;
}
