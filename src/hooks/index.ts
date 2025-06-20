/**
 * Consolidated hooks exports
 * Centralized access to all custom hooks
 */

// Common utility hooks
export * from "./common";

// Specific feature hooks
export { useCurrentTrack } from "./useCurrentTrack";
export { useForecastData } from "./useForecast";
export { useLiquidGlass } from "./useLiquidGlass";
export { useLocationBasedDefaults } from "./useLocationBasedDefaults";
export { useSpotifySearch } from "./useSpotifySearch";
export { useSpotifyPlayer } from "./useSpotifyPlayer";
export { useThemeManager } from "./useThemeManager";
export { useWeatherData, useThemeFromWeather } from "./useWeather";
export { useWeatherMusic } from "./useWeatherMusic";
