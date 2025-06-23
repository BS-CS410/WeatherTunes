/**
 * Comprehensive Library Exports - Refactored and Consolidated
 * Centralized access to all utility functions and services
 *
 * Architecture:
 * - /core: Core utilities (DOM, crypto, validation, arrays, strings, units, time)
 * - /design: Design system and theming (components, Material-UI)
 * - /weather: Weather-related APIs and utilities
 * - /music: Music/Spotify integration (auth, API, recommendations)
 * - /config: Configuration and setup (React Query, etc.)
 */

// === CORE UTILITIES ===
export * from "./core";

// === DESIGN SYSTEM ===
export * from "./design";

// === WEATHER UTILITIES ===
export * from "./weather";

// === MUSIC UTILITIES ===
export * from "./music";

// === CONFIGURATION ===
export * from "./config";

// === LEGACY COMPATIBILITY ===
// Re-export commonly used utilities at the root level for backwards compatibility
export { cn, debounce } from "./core";
export {
  COLORS,
  TYPOGRAPHY,
  BUTTON_STYLES,
  CARD_STYLES,
  LAYOUT,
  ANIMATIONS,
  LIQUID_GLASS_STYLES,
  createLiquidGlassButton,
  createLiquidGlassCard,
} from "./design";
export { fetchWeatherByCoords, getUserLocationAndFetch } from "./weather";
export { spotifyApi, startSpotifyLogin, getValidAccessToken } from "./music";
export { queryClient } from "./config";
