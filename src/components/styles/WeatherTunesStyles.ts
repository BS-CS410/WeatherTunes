/**
 * Centralized style system for WeatherTunesDisplay component
 * Single source of truth for all visual effects and styling patterns
 */

// Core animation and interaction patterns
export const interactionEffects = {
  // Standard hover effect - used by all interactive elements for consistency
  elementHover: "hover:-translate-y-1 hover:scale-105",
  // Group-triggered hover effect - for elements inside hover containers
  containerHover: "group-hover:-translate-y-1 group-hover:scale-105",
  // Enhanced hover effect - for high-impact elements like album art
  enhancedHover: "group-hover/album:-translate-y-2 group-hover/album:scale-110",
} as const;

// Text color changes on interaction
export const textInteractions = {
  // Primary text color change on hover
  primaryHover: "group-hover:text-gray-800 dark:group-hover:text-slate-100",
  // Secondary text color change on hover
  secondaryHover: "group-hover:text-gray-600 dark:group-hover:text-slate-300",
} as const;

// Shadow and depth effects
export const shadowEffects = {
  // Base shadow for all elevated elements
  base: "drop-shadow-lg",
  // Enhanced shadow on hover
  baseHover: "group-hover:drop-shadow-xl",
  // Image-specific shadow
  image: "shadow-lg",
  // Enhanced image shadow on hover
  imageHover: "group-hover/album:shadow-2xl",
} as const;

// Animation timing and transitions
export const transitions = {
  // Standard transition for all interactive elements
  standard: "transition-all duration-300 ease-out",
  // Fast transition for quick feedback
  quick: "transition-all duration-200 ease-out",
} as const;

// Typography system - responsive font styling with consistent unitless line-height
export const fontStyles = {
  locationText:
    "font-inter-tight text-sm sm:text-base md:text-lg lg:text-xl leading-[1.2] font-semibold tracking-wider uppercase",
  temperatureDisplay:
    "font-inter-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.85] font-bold",
  conditionText:
    "font-inter-tight text-lg sm:text-xl md:text-2xl lg:text-3xl leading-[1.1] font-extralight tracking-tighter lowercase",
  timeDisplay:
    "font-inter-tight text-xs sm:text-sm md:text-base lg:text-lg leading-[1.3] font-light tracking-tight whitespace-nowrap",
  musicTitle:
    "text-base sm:text-lg md:text-xl lg:text-2xl leading-[1.25] font-semibold",
  musicArtist: "text-sm sm:text-base md:text-lg lg:text-xl leading-[1.4]",
} as const;

// Color theme system - centralized color management
export const colorTheme = {
  primaryText: "text-gray-900 dark:text-slate-200",
  temperatureText: "text-gray-900 dark:text-cyan-50",
  conditionText: "text-gray-800 dark:text-cyan-100",
  timeText: "text-gray-700 dark:text-cyan-200",
  timeTextAlt: "text-gray-800 dark:text-cyan-300",
  separatorText: "text-gray-500 dark:text-cyan-300",
  artistText: "text-gray-700 dark:text-slate-400",
} as const;

// Utility function for combining style classes
export const combineStyles = (...classes: string[]): string => {
  return classes.join(" ");
};
