/**
 * Component Exports
 *
 * Organized by domain for better maintainability and discoverability.
 * Each domain represents a specific area of functionality within the app.
 */

// === SHARED COMPONENTS ===
// Reusable components used across multiple domains
export { GlassCard } from "./shared/GlassCard";
export { LoadingState, ErrorState } from "./shared/StateComponents";
export {
  SettingsSection,
  SettingsButtonGroup,
} from "./shared/SettingsComponents";
export { ErrorBoundary, withErrorBoundary } from "./shared/ErrorBoundary";

// === WEATHER DOMAIN ===
// Components related to weather display, forecast, and background visuals
export { VideoBackground } from "./weather/VideoBackground";
export { ForecastCard } from "./weather/ForecastCard";
export { WeatherDisplay } from "./weather/WeatherDisplay";

// === MUSIC DOMAIN ===
// Components for music playback, queue management, and audio controls
export { UpNext } from "./music/UpNext";
export { CurrentlyPlaying } from "./music/CurrentlyPlaying";
export { Favorites } from "./music/Favorites";

// === SETTINGS DOMAIN ===
// Settings interface and controls
export { SettingsButton } from "./settings/SettingsButton";
export { SettingsMenu } from "./settings/SettingsMenu";

// === LAYOUT DOMAIN ===
// Navigation, layout, and overall app structure
export { NavBar } from "./layout/NavBar";
export { AppLayout } from "./layout/AppLayout";
export { SectionWrapper } from "./layout/SectionWrapper";

// === THEME & PROVIDERS ===
// Theme and context providers
export { ThemeProvider } from "./ThemeProvider";

// === STYLE SYSTEM ===
// Centralized styling system for maximum maintainability
export * from "./styles/WeatherTunesStyles";
export { createElementStyles } from "./styles/ElementStyles";

// === SHARED COMPONENTS ===
// Reusable UI components and icons used across domains
export * from "./icons";

// === UI PRIMITIVES ===
// Base shadcn/ui components for consistent design system
export * from "./ui/button";
export * from "./ui/card";
export * from "./ui/input";
export * from "./ui/label";
export * from "./ui/navigation-menu";
