# WeatherTunes OAuth Testing Guide

## Overview

This comprehensive test suite ensures robust authentication handling and prevents the authorization errors and uncontrolled refresh loops that were previously experienced. The tests cover multiple layers of resilience and error handling.

## Test Structure

### Core Test Files

#### 1. `auth-simple.spec.ts` - Basic OAuth Flow
- Basic endpoint accessibility
- Frontend/backend connectivity
- CORS header validation
- Simple error handling

#### 2. `session-management.spec.ts` - Session Lifecycle
- Session persistence across requests
- Cookie behavior and security
- Error state handling
- Frontend callback processing

#### 3. `auth-error-handling.spec.ts` - Authentication Error Prevention ⚡ **NEW**
- **401 Error Handling**: Prevents infinite retry loops on authentication failures
- **404 Error Handling**: Graceful handling of missing resources without retries
- **Network Error Resilience**: Timeout handling and connection failure recovery
- **Component Initialization Loops**: Prevents multiple player initialization attempts
- **Error State Recovery**: Graceful recovery from temporary auth failures
- **Rate Limiting Protection**: Implements throttling for auth endpoints

#### 4. `frontend-state-management.spec.ts` - State Synchronization ⚡ **NEW**
- **Authentication State Sync**: Prevents auth state ping-pong between components
- **Component Lifecycle Management**: Proper cleanup without memory leaks
- **API Request Management**: Request deduplication and cancellation
- **Error Boundary Testing**: Graceful JavaScript error handling
- **Memory and Performance**: Event listener cleanup and reasonable request frequency

#### 5. `backend-resilience.spec.ts` - Server-Side Protection ⚡ **NEW**
- **Token Management**: Exponential backoff for failed refresh attempts
- **Spotify API Integration**: Rate limiting and circuit breaker patterns
- **Session Management**: Corruption handling and timeout protection
- **Database Resilience**: Storage failure recovery
- **Network Resilience**: Intermittent failure handling and timeout management

#### 6. `player-edge-cases.spec.ts` - Media Handling ⚡ **NEW**
- **Spotify SDK Failures**: SDK loading failures and initialization timeouts
- **Authentication Errors During Playback**: Prevents token refresh loops during media playback
- **Queue Management**: API failure handling and concurrent modification protection
- **Playback Control Edge Cases**: Device transfer failures and command error handling
- **Media State Synchronization**: Player state desync and rapid track change handling

#### 7. `integration-comprehensive.spec.ts` - End-to-End Scenarios ⚡ **NEW**
- **Complete OAuth Flow Protection**: Full authentication flow without infinite loops
- **Real-World Scenarios**: Session expiration, backend outages, concurrent component initialization
- **Performance and Resource Management**: Memory usage and request throttling validation
- **Error Recovery Validation**: Complete error recovery flow testing

## Key Anti-Pattern Protections

### 🚫 **Infinite Loop Prevention**
- **Token Refresh Loops**: Limits consecutive token refresh attempts
- **Authentication Check Loops**: Prevents components from repeatedly checking auth state
- **Player Initialization Loops**: Ensures Spotify player only initializes once
- **API Request Loops**: Implements circuit breakers for failing API calls

### 🔄 **State Management Protection**
- **Concurrent Auth Checks**: Deduplicates simultaneous authentication requests
- **Component Lifecycle**: Proper cleanup prevents memory leaks and ghost listeners
- **Error State Recovery**: Graceful recovery without cascading failures
- **Session Synchronization**: Prevents frontend/backend state desync

### ⚡ **Performance Safeguards**
- **Request Rate Limiting**: Prevents API endpoint hammering
- **Memory Leak Detection**: Monitors for excessive event listeners and timers
- **Network Timeout Handling**: Prevents hanging requests
- **Resource Cleanup**: Ensures proper component unmounting and player disconnect

## Setup Instructions

1. **Create Test Environment File**
   ```bash
   cp .env.test.example .env.test
   ```

2. **Configure Test Spotify Account**
   - Create a dedicated Spotify test account
   - Update `.env.test` with test credentials:
     ```
     SPOTIFY_TEST_EMAIL=your-test-email@example.com
     SPOTIFY_TEST_PASSWORD=your-test-password
     ```

3. **Start Development Servers**
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   cd backend && python run.py
   ```

4. **Run OAuth Tests**
   ```bash
   # Run all tests
   npx playwright test

   # Run only auth tests
   npx playwright test auth-flow

   # Run with UI (helpful for debugging)
   npx playwright test --ui

   # Run in headed mode to see browser
   npx playwright test --headed
   ```

## Test Coverage

The OAuth test suite covers:

### Full Authentication Flow
- ✅ Login button click
- ✅ Spotify OAuth redirect
- ✅ Credential entry
- ✅ Authorization approval
- ✅ Callback handling
- ✅ Frontend redirect
- ✅ Session establishment

### API Endpoints
- ✅ `/auth/login` - OAuth initiation
- ✅ `/auth/callback` - OAuth callback
- ✅ `/auth/session` - Session status
- ✅ `/auth/token` - Access token retrieval
- ✅ `/auth/logout` - Session termination

### Error Scenarios
- ✅ Missing authorization code
- ✅ OAuth error handling
- ✅ Unauthenticated requests
- ✅ Token expiration

### Backend Health
- ✅ Server connectivity
- ✅ CORS configuration
- ✅ Service status

## Debugging Tips

1. **Use `--headed` mode** to see what's happening in the browser
2. **Check test artifacts** in `test-results/` for screenshots and videos
3. **Review network requests** in the HTML report
4. **Verify environment variables** are loaded correctly
5. **Check backend logs** for authentication errors

## Common Issues

1. **Spotify Test Credentials**: Ensure test account has proper permissions
2. **Backend Configuration**: Verify Spotify app settings in `.env`
3. **CORS Issues**: Check CORS configuration in backend
4. **Token Expiration**: Tests handle token refresh automatically
5. **Rate Limiting**: Spotify may rate limit test requests

## Running Specific Tests

```bash
# Backend health only
npx playwright test --grep "Backend Health"

# Full OAuth flow only
npx playwright test --grep "complete OAuth"

# Error handling only
npx playwright test --grep "handles.*error"
```
