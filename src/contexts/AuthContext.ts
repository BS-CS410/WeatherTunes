import * as React from 'react';
import type { User } from '@/services/AuthService';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  login: () => Promise<void>;
  logout: () => void;
  handleCallback: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;
  isAuthenticated: boolean;
}

export const AuthContext = React.createContext<AuthContextValue | null>(null);
