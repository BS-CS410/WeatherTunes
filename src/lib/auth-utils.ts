/**
 * Authentication service - now using frontend-only PKCE implementation
 * Migration: Replaced backend-dependent implementation with frontend-only approach
 */

// Re-export the frontend auth service and types to maintain compatibility
export { authService, type AuthUser, type AuthState } from "./auth-frontend";
