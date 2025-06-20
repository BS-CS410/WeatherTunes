# OAuth Setup and Troubleshooting Guide

## Overview

This guide covers the OAuth authentication flow setup, common issues, and troubleshooting steps for the WeatherTunes application.

## Environment Setup

### 1. Spotify Developer Configuration

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use existing one
3. In app settings, add redirect URI: `http://127.0.0.1:8000/auth/callback`
4. **Important**: Use `127.0.0.1` instead of `localhost` for consistency

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Flask Configuration
FLASK_SECRET_KEY=your_random_secret_key_here

# Spotify API Credentials
SPOTIPY_CLIENT_ID=your_spotify_client_id
SPOTIPY_CLIENT_SECRET=your_spotify_client_secret
SPOTIPY_REDIRECT_URI=http://127.0.0.1:8000/auth/callback

# OpenWeather API Key
OPENWEATHER_API_KEY=your_openweather_api_key
```

### 3. URL Consistency

**All URLs must use `127.0.0.1` for consistency:**
- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:8000`
- Spotify Redirect URI: `http://127.0.0.1:8000/auth/callback`

## Authentication Flow

### 1. Login Process

1. User clicks login → Frontend redirects to `/auth/login`
2. Backend redirects to Spotify OAuth with proper scopes
3. User authorizes on Spotify
4. Spotify redirects to `/auth/callback` with authorization code
5. Backend exchanges code for access/refresh tokens
6. Backend saves tokens in session storage
7. Backend redirects user to frontend home page

### 2. Session Management

- Sessions use secure Flask session storage
- Tokens are automatically refreshed when needed
- Session cookies are configured for cross-port access
- Session expires after 24 hours

## Common Issues & Solutions

### 1. CORS Headers Missing

**Problem**: CORS headers only appear for cross-origin requests

**Solution**: We've implemented custom CORS handlers that ensure headers are always present:
- Health endpoint: Always returns CORS headers
- Auth endpoints: Enhanced with `ensure_cors_headers()`
- All responses include proper CORS configuration

### 2. Session Cookies Not Working

**Problem**: Cookies not shared between frontend (5173) and backend (8000)

**Solutions**:
- Set `SESSION_COOKIE_DOMAIN` to `127.0.0.1`
- Use `SESSION_COOKIE_SAMESITE: "Lax"`
- Ensure `supports_credentials=True` in CORS config

### 3. OAuth Redirect Mismatch

**Problem**: Spotify rejects redirect URI

**Solutions**:
- Ensure Spotify app settings match exactly: `http://127.0.0.1:8000/auth/callback`
- Use `127.0.0.1` consistently (not `localhost`)
- Check environment variables are loaded correctly

### 4. Token Refresh Issues

**Problem**: Access tokens expire and refresh fails

**Solutions**:
- Backend automatically refreshes tokens 5 minutes before expiry
- Comprehensive error handling logs token refresh failures
- Users are redirected to re-authenticate if refresh fails

## Testing

### 1. Automated Tests

```bash
# Run all auth tests
npm run test:auth

# Run specific test suites
npx playwright test auth-simple.spec.ts
npx playwright test session-management.spec.ts
```

### 2. Manual Testing

1. **Health Check**: Visit `http://127.0.0.1:8000/health`
2. **Login Flow**: Go to `http://127.0.0.1:8000/auth/login`
3. **Session Info**: Check `http://127.0.0.1:8000/auth/session`

### 3. Debug Information

Check browser developer tools:
- Network tab for CORS headers
- Application tab for session cookies
- Console for any JavaScript errors

## Enhanced Error Logging

The backend now provides detailed logging for:
- OAuth callback states and errors
- Token refresh attempts and failures
- Session creation and destruction
- CORS header application

## Security Considerations

- Never commit real credentials to version control
- Use strong random secret keys in production
- Consider using HTTPS in production with secure cookies
- Regularly rotate API keys and secrets

## Development vs Production

### Development
- HTTP allowed
- Debug logging enabled
- Session cookies not secure
- CORS allows multiple origins

### Production
- HTTPS required
- Minimal logging
- Secure session cookies
- CORS restricted to production domains
