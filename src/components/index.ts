/**
 * Component Exports
 *
 * Organized by domain for better maintainability and discoverability.
 * Each domain represents a specific area of functionality within the app.
 */

// === WEATHER DOMAIN ===
// Components related to weather display, forecast, and background visuals
export { VideoBackground } from "./VideoBackground";
export { WeatherDisplay } from "./WeatherDisplay";
export { ForecastCard } from "./ForecastCard";

// === MUSIC DOMAIN ===
// Components for music playback, queue management, and audio controls
export { default as CurrentlyPlaying } from "./CurrentlyPlaying";
export { UpNext } from "./UpNext";

// === LAYOUT DOMAIN ===
// Navigation, settings, unified displays, and overall app structure
export { default as NavBar } from "./NavBar";
export { SettingsButton } from "./SettingsButton";
export { SettingsMenu } from "./SettingsMenu";
export { default as UnifiedDisplay } from "./UnifiedDisplay";

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
