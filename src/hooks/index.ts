/**
 * Unified Hook Exports
 *
 * Consolidated and simplified hooks for better maintainability
 */

// Core weather and data hooks (unified)
export { useWeatherData, useThemeFromWeather } from "@/hooks/useWeather";
export { useForecastData } from "@/hooks/useForecast";

// Music and Spotify hooks (streamlined)
export { useCurrentTrack } from "@/hooks/useCurrentTrack";
export { useSpotifySearch } from "@/hooks/useSpotifySearch";

// Authentication hooks
export { useAuth } from "@/hooks/utility";

// Settings and storage hooks
export { useSettings } from "@/hooks/utility";
export { useLocalStorage } from "@/hooks/utility";
export { useLocationBasedDefaults } from "@/hooks/useLocationBasedDefaults";

// Theme and styling hooks
export { useThemeManager } from "@/hooks/useThemeManager";
