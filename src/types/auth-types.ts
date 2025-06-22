export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

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
