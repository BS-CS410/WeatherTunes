/**
 * Consolidated authentication types
 * Single source of truth for all authentication-related interfaces
 */

export interface User {
  id: string;
  display_name: string;
  email: string;
  images?: Array<{ url: string }>;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface AuthCallbackParams {
  code: string;
  state: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
}

export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export type TokenData = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};
