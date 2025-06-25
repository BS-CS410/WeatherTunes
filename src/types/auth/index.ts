/**
 * Consolidated authentication types
 * Single source of truth for all authentication-related interfaces
 */

import { AsyncState } from '..';

export interface User {
  id: string;
  displayName: string;
  email: string;
  images: Array<{ url: string }>;
}

export interface AuthCallbackParams {
  code: string;
  state: string;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export type AuthState = AsyncState<User>;
