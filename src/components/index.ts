/**
 * Component Exports - WeatherTunes Component Library
 *
 * Card-centric hierarchy where names immediately reveal component purpose.
 * All main UI units are "Cards", with supporting components clearly named.
 */

// === MAIN COMPONENTS ===
// Primary components used directly in MainPage
export { WeatherMusicCard } from "./WeatherMusicCard";
export { default as ForecastCard } from "./ForecastCard";
export { QueueCard } from "./QueueCard";
export { FavoritesCard } from "./FavoritesCard";
export { SpotifySearchCard } from "./SpotifySearchCard";
export { SettingsCard } from "./SettingsCard";

// === UI PRIMITIVES ===
// Base shadcn/ui components with unified styling system
export * from "./ui/button";
export * from "./ui/card";
export * from "./ui/segmented-control";
export * from "./ui/slider";

// === SHARED COMPONENTS ===
// Reusable components used across multiple domains
export { LoadingSpinner, ErrorDisplay } from "./shared/StatusComponents";
export {
  SettingsSection,
  SettingsButtonGroup,
} from "./settings/SettingsComponents";
export { ErrorBoundary, withErrorBoundary } from "./shared/ErrorBoundary";
export { LoginPopup } from "./shared/LoginPopup";
export { LiquidGlassContainer } from "./shared/LiquidGlassContainer";

// === AUTH DOMAIN ===
// Authentication components and flows
export { OAuthCallback } from "./shared/OAuthCallback";

// === WEATHER DOMAIN ===
// Components related to weather display, forecast, and background visuals
export { WeatherBackground } from "./weather/WeatherBackground";

// === MUSIC DOMAIN ===
// Components for music playback, queue management, and audio controls
export { SpotifyWebPlayer } from "./music/SpotifyWebPlayer";
export { SpotifyMiniPlayer } from "./music/SpotifyMiniPlayer";

// === SETTINGS DOMAIN ===
// Settings interface and controls
export { SettingsButton } from "./settings/SettingsButton";
export { SettingsPanel } from "./settings/SettingsPanel";
export { ThemeSwitcher } from "./settings/ThemeSwitcher";
export { UnitSelector } from "./settings/UnitSelector";

// === LAYOUT DOMAIN ===
// Navigation, layout, and overall app structure
export { AppLayout } from "./layout/AppLayout";
export { SectionWrapper } from "./layout/SectionWrapper";
export { ThemeProvider } from "./layout/ThemeProvider";

// === ICONS ===
// Custom icon components with consistent styling
export * from "./icons";
