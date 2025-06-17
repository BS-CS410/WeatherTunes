/**
 * Component Exports - Trans// === MUSIC DOMAIN ===
// Components for music playback, queue management, and audio controls
export { QueueCard } from "./music/QueueCard";
export { CurrentTrackCard } from "./music/CurrentTrackCard";
export { FavoritesCard } from "./music/FavoritesCard";
export { MusicDebugPanel } from "./music/MusicDebugPanel";

// === SETTINGS DOMAIN ===
// Settings interface and controls
export { SettingsButton } from "./settings/SettingsButton";
export { SettingsCard } from "./settings/SettingsCard";ng Scheme
 *
 * Card-centric hierarchy where names immediately reveal component purpose.
 * All main UI units are "Cards", with supporting components clearly named.
 */

// === UI PRIMITIVES ===
// Base shadcn/ui components with unified styling system
export * from "./ui/button";
export * from "./ui/card";

// === SHARED COMPONENTS ===
// Reusable components used across multiple domains
export { BaseCard } from "./shared/BaseCard";
export { LoadingSpinner, ErrorDisplay } from "./shared/StatusComponents";
export {
  SettingsSection,
  SettingsButtonGroup,
} from "./shared/SettingsComponents";
export { ErrorBoundary, withErrorBoundary } from "./shared/ErrorBoundary";
export { LoginPopup } from "./shared/LoginPopup";

// === WEATHER DOMAIN ===
// Components related to weather display, forecast, and background visuals
export { WeatherBackground } from "./weather/WeatherBackground";
export { ForecastCard } from "./weather/ForecastCard";
export { WeatherCard } from "./weather/WeatherCard";

// === MUSIC DOMAIN ===
// Components for music playback, queue management, and audio controls
export { QueueCard } from "./music/QueueCard";
export { CurrentTrackCard } from "./music/CurrentTrackCard";
export { FavoritesCard } from "./music/FavoritesCard";
export { MusicDebugPanel } from "./music/MusicDebugPanel";

// === SETTINGS DOMAIN ===
// Settings interface and controls
export { SettingsButton } from "./settings/SettingsButton";
export { SettingsCard } from "./settings/SettingsCard";

// === LAYOUT DOMAIN ===
// Navigation, layout, and overall app structure
export { AppLayout } from "./layout/AppLayout";
export { SectionWrapper } from "./layout/SectionWrapper";
export { ThemeProvider } from "./layout/ThemeProvider";

// === ICONS ===
// Custom icon components with consistent styling
export * from "./icons";

// === STYLE SYSTEM (Deprecated - Use unifiedStyles) ===
// Legacy style exports - prefer importing from @/lib/unifiedStyles
export * from "./styles/WeatherTunesStyles";
export { createElementStyles } from "./styles/ElementStyles";
