/**
 * Consolidated hooks exports
 * Centralized access to all custom hooks
 */

// Common utility hooks
export * from "./common";

// Auth hooks
export { useAuth } from "./useAuth";

// Specific feature hooks
export { useLocationBasedDefaults } from "./useLocationBasedDefaults";
export { useThemeManager } from "./useThemeManager";
export { useWeatherData, useThemeFromWeather } from "./useWeatherData";
export { useWeatherQueue } from "./useWeatherQueue";

// Consolidated Spotify hooks
export * from "./spotify";
