# Spotify Authentication Flow - AI Agent Documentation

This document outlines the Spotify authentication flow and related components within the WeatherTunes application, intended for use by AI agents.

## 1. Backend (Python/Flask)

The backend handles the OAuth 2.0 process with Spotify and manages user sessions.

### Key Files & Endpoints:

- **`backend/app/routes/auth.py`**: Core authentication logic.
  - `POST /auth/login`: Initiates Spotify login by redirecting to Spotify's authorization URL.
    - Uses `sp_oauth.get_authorize_url()`.
  - `GET /auth/callback`: Handles Spotify's callback after user authorization.
    - Receives authorization `code` or `error`.
    - Exchanges `code` for `access_token`, `refresh_token` via `sp_oauth.get_access_token(code)`.
    - Fetches Spotify user profile using the access token.
    - Calls `save_auth_session()` to store user ID and tokens.
    - Calls `user_data_service.update_user_login()`.
    - Redirects to frontend (`AppConfig.FRONTEND_URL` usually to `/auth-callback` or main page with `?auth=success`).
  - `POST /auth/logout`: Clears user session via `clear_auth_session()`.
  - `GET /auth/session`: Returns current authentication status (`{ "authenticated": boolean, "username": string | null }`). Used by frontend to check login state.
  - `GET /auth/userinfo`: Returns `{ "spotify_username": string }` if authenticated.
- **`backend/app/utils/auth.py`**: Session management utilities.
  - `get_authenticated_user() -> Optional[str]`: Returns Spotify username from session.
  - `is_user_authenticated() -> bool`: Checks for `access_token` and `spotify_username` in session.
  - `save_auth_session(username: str, tokens: SpotifyTokens)`: Saves username, access token, refresh token, and expiry time into Flask session.
  - `get_auth_session() -> Optional[AuthSession]`: Returns `AuthSession` object (username, tokens) if authenticated.
  - `clear_auth_session()`: Clears session data.
- **`backend/app/config.py`**: Configuration.
  - `SpotifyConfig`:
    - `CLIENT_ID`, `CLIENT_SECRET`: Spotify app credentials (from env vars).
    - `REDIRECT_URI`: Callback URL registered with Spotify (from env var).
    - `SCOPE`: Space-separated string of requested Spotify permissions (e.g., `user-library-read`, `user-read-playback-state`).
  - `AppConfig`:
    - `FRONTEND_URL`: Base URL for the frontend application.
    - `CALLBACK_URL`: Expected frontend callback path (e.g., `FRONTEND_URL + /auth-callback`).
- **`backend/app/models/models.py`**: Pydantic data models.
  - `SpotifyTokens(BaseModel)`: `access_token: str`, `refresh_token: Optional[str]`, `expires_at: Optional[int]`.
  - `AuthSession(BaseModel)`: `spotify_username: str`, `tokens: SpotifyTokens`.
- **Authenticated Routes**: Many other backend routes (e.g., in `user.py`, `liked_songs.py`, `recommended.py`) use `get_authenticated_user()` or `get_auth_session()` to protect endpoints and access user-specific data.

### Dependencies:

- `spotipy`: Python library for Spotify Web API.
- `Flask`: Web framework, uses Flask sessions for storing auth state.

## 2. Frontend (TypeScript/React)

The frontend initiates login, handles the callback, and manages UI based on auth state.

### Key Files & Components:

- **`src/pages/Login.tsx`**:
  - Contains a login button.
  - `handleSpotifyLogin()`: Redirects browser to backend's `/auth/login` endpoint (`http://127.0.0.1:8000/auth/login`).
- **`src/pages/AuthCallback.tsx`**:
  - Target page after backend redirects from Spotify callback.
  - `useEffect` hook fetches `http://127.0.0.1:8000/auth/session` (using `credentials: "include"`).
  - Navigates to main app (`/`) on successful authentication, or to `/login` on failure.
- **`src/hooks/useAuth.ts`**: Custom hook for global auth state management.
  - `authStatus`: State (`isAuthenticated`, `isLoading`, `username`, `error`).
  - `checkAuthStatus()`: Async function. Calls backend `/auth/session` via `apiClient.get()`. Updates `authStatus`. Invoked on hook initialization.
  - `logout()`: Async function. Calls backend `/auth/logout` via `apiClient.post()`. Resets `authStatus`.
- **`src/lib/apiClient.ts`**: Fetch API wrapper.
  - Sets `credentials: "include"` on all requests to ensure session cookies are sent to the backend.
  - Provides `get`, `post`, `put`, `delete` methods.
- **Components Requiring/Using Authentication**:
  - **`src/components/music/QueueCard.tsx`**:
    - Uses `useAuth()` hook.
    - Disables/alters functionality if `!isAuthenticated` or `authLoading`. Prompts login.
  - **`src/components/music/CurrentTrackCard.tsx`**:
    - Uses `useAuth()` (implicitly or directly).
    - Prompts login if not authenticated, redirecting to backend login.
  - **`src/components/music/FavoritesCard.tsx`**:
    - Prompts login if not authenticated, redirecting to frontend `/login` page.
  - **`src/components/shared/LoginPopup.tsx`**:
    - Login popup, redirects to backend login.
  - Many components throughout the app will likely consume `useAuth` or a context derived from it to conditionally render UI or enable features.

### Queue System & Auth:

- **`src/lib/queueManager.ts`**: Generates track queues. While not directly calling auth APIs, its ability to provide personalized or Spotify-data-driven queues depends on an authenticated session to fetch user data (e.g., liked songs, recommendations) via backend calls that would require auth.
- **`src/contexts/CurrentTrackContext.tsx`**: Manages the current track and queue. Access to its features (especially those involving user-specific Spotify data) is gated by authentication status from `useAuth()` via components like `QueueCard.tsx`.

## 3. Data Flow (Spotify OAuth 2.0 Authorization Code Flow)

1.  **FE**: User clicks "Login with Spotify".
2.  **FE -> BE**: Browser redirects to `BE_HOST/auth/login`.
3.  **BE -> Spotify**: BE redirects browser to Spotify's authorization URL.
4.  **Spotify**: User logs in & authorizes app.
5.  **Spotify -> BE**: Spotify redirects browser to `BE_HOST/auth/callback` (the `REDIRECT_URI`) with an authorization `code`.
6.  **BE**: `/auth/callback` exchanges `code` for `access_token` & `refresh_token` with Spotify. User profile is fetched.
7.  **BE**: Session is created/updated. `spotify_username` and tokens are stored in server-side session (cookie).
8.  **BE -> FE**: BE redirects browser to `FE_HOST/auth-callback` (or main page with `?auth=success`).
9.  **FE**: `AuthCallback.tsx` (or `useAuth` on app load) calls `BE_HOST/auth/session` (with cookies).
10. **BE -> FE**: `/auth/session` returns `{ "authenticated": true/false, "username": "..." }`.
11. **FE**: `useAuth` updates state. UI re-renders based on auth status.

## 4. Key Spotify Scopes Requested

From `backend/app/config.py -> SpotifyConfig.SCOPE`:

- `user-library-read`
- `user-read-email`
- `user-read-private`
- `user-read-playback-state`
- `user-modify-playback-state`
- `user-read-currently-playing`

## 5. Important Considerations for AI

- **Token Expiration & Refresh**: Access tokens are short-lived (typically 1 hour). The current backend code retrieves a `refresh_token` but does not show an explicit token refresh mechanism. A production system must use the `refresh_token` to obtain new access tokens when the current one expires, usually by intercepting API errors indicating an expired token.
- **Error Handling**: Basic error handling exists in `auth.py` and `useAuth.ts`. More comprehensive error handling might be needed for various OAuth scenarios.
- **Security**:
  - `CLIENT_SECRET` must remain confidential (env variables are appropriate).
  - `REDIRECT_URI` must be precisely configured in Spotify Developer Dashboard and match the backend config.
- **Session Management**: Authentication relies on HTTP cookies for session management between frontend and backend. `apiClient.ts` correctly includes credentials.
- **Queue System**: The queue system's advanced features (Spotify-based recommendations, user's liked songs for seeding) are contingent upon a successful Spotify authentication. If auth is missing, queue functionality will be degraded to local/generic tracks or disabled.
