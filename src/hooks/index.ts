// Hook organization and exports for better maintainability

// Core weather and data hooks
export { useWeatherData, useThemeFromWeather } from "@/hooks/useWeather";
export { useForecastData } from "@/hooks/useForecast";

// UI and interaction hooks
export { useCardOrder } from "@/hooks/useCardOrder";

// Settings and storage hooks
export { useSettings } from "@/hooks/useSettings";
export { useLocalStorage } from "@/hooks/useLocalStorage";
export { useLocationBasedDefaults } from "@/hooks/useLocationBasedDefaults";

// Theme and styling hooks
export { useThemeManager } from "@/hooks/useThemeManager";
