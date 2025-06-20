/**
 * Component Exports - WeatherTunes Component Library
 *
 * Card-centric hierarchy where names immediately reveal component purpose.
 * All main UI units are "Cards", with supporting components clearly named.
 */

// === UI PRIMITIVES ===
// Base shadcn/ui components with unified styling system
export * from "./ui/button";
export * from "./ui/card";
export * from "./ui/segmented-control";
export * from "./ui/slider";

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
export { WeatherMusicCard } from "./shared/WeatherMusicCard";

// === WEATHER DOMAIN ===
// Components related to weather display, forecast, and background visuals
export { WeatherBackground } from "./weather/WeatherBackground";
export { ForecastCard } from "./weather/ForecastCard";

// === MUSIC DOMAIN ===
// Components for music playback, queue management, and audio controls
export { QueueCard } from "./music/QueueCard";
export { FavoritesCard } from "./music/FavoritesCard";
export { SpotifySearchCard } from "./music/SpotifySearchCard";
export { SpotifyWebPlayer } from "./music/SpotifyWebPlayer";
export { SpotifyMiniPlayer } from "./music/SpotifyMiniPlayer";

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

// === LIQUID GLASS COMPONENTS ===
// Advanced liquid glass effects inspired by Apple's design
export * from "./liquid-glass";
