/**
 * Consolidated hooks exports
 * Centralized access to all custom hooks
 */

// Common utility hooks (includes useSettings, useServices, and weather utilities)
export * from "./common";

// Auth hooks
export { useAuth } from "./useAuth";

// Specific feature hooks
export { useLocationBasedDefaults } from "./useLocationBasedDefaults";
export { useThemeManager, useThemeFromWeather } from "./useThemeManager";
export { useWeatherData, useWeather } from "./useWeatherData";
export { useWeatherQueue } from "./useWeatherQueue";
export { useWeatherForecast } from "./useWeatherForecast";

// Consolidated Spotify hooks
export * from "./spotify";
