/**
 * Comprehensive Design System - Preserving Liquid Glass Visual Effects
 * Ruthlessly simplified architecture while maintaining visual fidelity
 */

// Core liquid glass styles - consolidated for maximum reuse
const GLASS_BASE = "backdrop-blur-xl backdrop-saturate-[1.8] border";
const GLASS_LIGHT = "bg-white/[0.05] border-white/[0.12]";
const GLASS_DARK = "dark:bg-black/[0.12] dark:border-white/[0.04]";
const GLASS_HOVER =
  "hover:bg-white/[0.08] hover:border-white/[0.18] hover:backdrop-saturate-[2.0] dark:hover:bg-black/[0.15] dark:hover:border-white/[0.06]";

// Chromatic aberration effect
const CHROMATIC_SHADOW =
  "shadow-[inset_0_0_20px_rgba(255,255,255,0.05),inset_1px_0_0_rgba(255,0,0,0.02),inset_-1px_0_0_rgba(0,255,0,0.02),inset_0_1px_0_rgba(0,0,255,0.02)] dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.02),inset_1px_0_0_rgba(255,0,0,0.01),inset_-1px_0_0_rgba(0,255,0,0.01),inset_0_1px_0_rgba(0,0,255,0.01)]";

export const COLORS = {
  glass: {
    light: `${GLASS_BASE} ${GLASS_LIGHT}`,
    dark: `${GLASS_BASE} ${GLASS_DARK}`,
    interactive: `${GLASS_BASE} ${GLASS_LIGHT} ${GLASS_DARK} ${GLASS_HOVER}`,
    modal: `${GLASS_BASE} bg-white/[0.06] backdrop-blur-2xl backdrop-saturate-[2.2] border-white/[0.15] dark:bg-black/[0.18] dark:border-white/[0.06]`,
    enhanced: `${GLASS_BASE} ${GLASS_LIGHT} ${GLASS_DARK} shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),inset_0_0_20px_rgba(255,255,255,0.05)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),inset_0_0_20px_rgba(255,255,255,0.02)]`,
    segmented: `${GLASS_BASE} bg-white/[0.03] border-white/[0.08] shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2)] dark:bg-black/[0.08] dark:border-white/[0.03] dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.06)]`,
    segmentedActive:
      "bg-white/[0.90] backdrop-blur-sm border border-white/[0.35] shadow-[0_0.5px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] dark:bg-white/[0.15] dark:border-white/[0.18] dark:shadow-[0_0.5px_4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]",
    sliderTrack: `backdrop-blur-lg backdrop-saturate-[1.6] bg-white/[0.08] border border-white/[0.12] dark:bg-black/[0.12] dark:border-white/[0.04]`,
    sliderKnob:
      "bg-white/[0.95] backdrop-blur-sm border border-white/[0.5] shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] dark:bg-white/[0.90] dark:border-white/[0.3] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]",
    hexIcon:
      "bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-lg backdrop-saturate-[1.8] border border-white/[0.12] dark:from-black/[0.20] dark:to-black/[0.12] dark:border-white/[0.06]",
    sidebar: `${GLASS_BASE} bg-white/[0.06] border-r border-white/[0.12] dark:bg-black/[0.20] dark:border-white/[0.04]`,
    floating: `${GLASS_BASE} bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-[2.4] border-white/[0.25] shadow-[0_20px_50px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)] dark:bg-black/[0.25] dark:border-white/[0.15] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]`,
    chromatic: `${GLASS_BASE} ${GLASS_LIGHT} ${GLASS_DARK} ${CHROMATIC_SHADOW}`,
  },
  text: {
    primary:
      "text-gray-950 drop-shadow-lg dark:text-white dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
    secondary:
      "text-gray-800 drop-shadow-lg dark:text-gray-100 dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
    muted:
      "text-gray-700 drop-shadow-lg dark:text-gray-200 dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
    interactive: "hover:text-gray-950 dark:hover:text-white",
    weather:
      "text-gray-950 drop-shadow-lg dark:text-white dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
    condition:
      "text-gray-900 drop-shadow-lg dark:text-gray-50 dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
    onGlass: "text-gray-900 dark:text-white drop-shadow-sm",
    onDarkGlass: "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
    subtle:
      "text-gray-600 drop-shadow-lg dark:text-gray-300 dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
    accent: "text-blue-600 dark:text-blue-400 drop-shadow-sm",
    error: "text-red-600 dark:text-red-400 drop-shadow-sm",
    success: "text-green-600 dark:text-green-400 drop-shadow-sm",
    warning: "text-amber-600 dark:text-amber-400 drop-shadow-sm",
  },
  surface: {
    primary: "bg-gray-50 dark:bg-gray-900",
    secondary: "bg-gray-100 dark:bg-gray-800",
    elevated: "bg-white dark:bg-gray-800 shadow-lg",
    transparent: "bg-transparent",
  },
  border: {
    default: "border-gray-200 dark:border-gray-700",
    muted: "border-gray-100 dark:border-gray-800",
    glass: "border-white/[0.12] dark:border-white/[0.04]",
    accent: "border-blue-200 dark:border-blue-800",
  },
};

export const TYPOGRAPHY = {
  heading: {
    h1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
    h2: "text-3xl md:text-4xl font-bold tracking-tight",
    h3: "text-2xl md:text-3xl font-semibold tracking-tight",
    h4: "text-xl md:text-2xl font-semibold tracking-tight",
    h5: "text-lg md:text-xl font-semibold",
    h6: "text-base md:text-lg font-semibold",
  },
  body: {
    large: "text-lg leading-relaxed",
    default: "text-base leading-normal",
    small: "text-sm leading-normal",
    tiny: "text-xs leading-tight",
    // Add missing sizes
    lg: "text-lg leading-relaxed",
    base: "text-base leading-normal",
    sm: "text-sm leading-normal",
    xs: "text-xs leading-tight",
  },
  display: {
    title: "text-6xl md:text-8xl font-black tracking-tighter",
    subtitle: "text-2xl md:text-3xl font-light tracking-wide",
    // Add missing sizes
    xl: "text-5xl md:text-6xl font-bold tracking-tight",
    lg: "text-4xl md:text-5xl font-bold tracking-tight",
    md: "text-3xl md:text-4xl font-bold tracking-tight",
  },
  // Add weather-specific typography
  weather: {
    location: "text-lg md:text-xl font-medium tracking-wide",
    temperature: "text-6xl md:text-7xl font-light tracking-tighter",
    condition: "text-base md:text-lg font-medium",
    time: "text-sm font-medium",
  },
  code: {
    inline:
      "font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded",
    block:
      "font-mono text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto",
  },
  weight: {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    black: "font-black",
  },
};

export const BUTTON_STYLES = {
  base: "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  glass: {
    primary: `${COLORS.glass.interactive} ${COLORS.text.primary} hover:scale-[1.02] active:scale-[0.98] focus:ring-white/20`,
    secondary: `${COLORS.glass.light} ${COLORS.text.secondary} hover:scale-[1.02] active:scale-[0.98] focus:ring-white/20`,
    ghost:
      "bg-transparent hover:bg-white/[0.05] dark:hover:bg-black/[0.05] text-gray-700 dark:text-gray-200",
  },
  solid: {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    warning: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500",
    error: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  },
  outline: {
    primary:
      "border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950",
    secondary:
      "border border-gray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-950",
  },
  size: {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
    icon: "p-2",
  },
  // Add missing button styles
  liquidGlass: `${COLORS.glass.enhanced} hover:scale-[1.02] active:scale-[0.98] focus:ring-white/20`,
  ghost:
    "bg-transparent hover:bg-white/[0.05] dark:hover:bg-black/[0.05] text-gray-700 dark:text-gray-200",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
  icon: "p-2 rounded-lg hover:scale-105 active:scale-95 transition-transform",
};

const CARD_BASE = "rounded-lg overflow-hidden";

export const CARD_STYLES = {
  base: CARD_BASE,
  glass: {
    default: `${COLORS.glass.interactive} ${CARD_BASE}`,
    elevated: `${COLORS.glass.floating} ${CARD_BASE}`,
    subtle: `${COLORS.glass.light} ${CARD_BASE}`,
  },
  solid: {
    default: `${COLORS.surface.elevated} ${CARD_BASE} border ${COLORS.border.default}`,
    primary: `bg-blue-50 dark:bg-blue-950 ${CARD_BASE} border ${COLORS.border.accent}`,
  },
  padding: {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  },
  // Add missing card styles
  interactive: `${COLORS.glass.interactive} ${CARD_BASE} hover:scale-[1.01] transition-transform cursor-pointer`,
};

export const INPUT_STYLES = {
  base: "w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  glass: `${COLORS.glass.interactive} ${COLORS.text.primary} placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-white/20`,
  solid: `bg-white dark:bg-gray-800 ${COLORS.border.default} text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500`,
  size: {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  },
  state: {
    error: "border-red-500 focus:ring-red-500",
    success: "border-green-500 focus:ring-green-500",
    warning: "border-amber-500 focus:ring-amber-500",
  },
};

export const LAYOUT = {
  container: {
    sm: "max-w-sm mx-auto px-4",
    md: "max-w-md mx-auto px-4",
    lg: "max-w-lg mx-auto px-4",
    xl: "max-w-xl mx-auto px-4",
    "2xl": "max-w-2xl mx-auto px-4",
    "4xl": "max-w-4xl mx-auto px-4",
    "6xl": "max-w-6xl mx-auto px-4",
    full: "w-full px-4",
    // Add missing container styles
    center: "mx-auto px-4",
    column: "flex flex-col",
  },
  spacing: {
    xs: "space-y-1",
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
    xl: "space-y-8",
    "2xl": "space-y-12",
    // Add missing spacing
    micro: "space-y-0.5",
  },
  // Add missing padding styles
  padding: {
    none: "p-0",
    xs: "p-1",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
    "2xl": "p-12",
    button: {
      sm: "px-3 py-1.5",
      md: "px-4 py-2",
      lg: "px-6 py-3",
    },
    section: {
      sm: "py-4 px-4",
      md: "py-6 px-6",
      lg: "py-8 px-8",
    },
  },
  grid: {
    cols1: "grid grid-cols-1 gap-4",
    cols2: "grid grid-cols-1 md:grid-cols-2 gap-4",
    cols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
    cols4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
  },
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    start: "flex items-center justify-start",
    end: "flex items-center justify-end",
    col: "flex flex-col",
    colCenter: "flex flex-col items-center justify-center",
  },
};

export const ANIMATIONS = {
  transition: {
    fast: "transition-all duration-150 ease-in-out",
    default: "transition-all duration-200 ease-in-out",
    slow: "transition-all duration-300 ease-in-out",
    // Add missing transition
    standard: "transition-all duration-200 ease-in-out",
  },
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin",
  ping: "animate-ping",
  slideIn: {
    left: "animate-slide-in-left",
    right: "animate-slide-in-right",
    up: "animate-slide-in-up",
    down: "animate-slide-in-down",
  },
  fadeIn: "animate-fade-in",
  fadeOut: "animate-fade-out",
  scale: {
    hover: "hover:scale-105 active:scale-95",
    press: "active:scale-95",
  },
  glow: "animate-glow",
  shimmer: "animate-shimmer",
};

// Weather-specific design tokens
export const WEATHER_STYLES = {
  temperature: {
    hot: "text-red-500 dark:text-red-400",
    warm: "text-orange-500 dark:text-orange-400",
    mild: "text-yellow-500 dark:text-yellow-400",
    cool: "text-blue-500 dark:text-blue-400",
    cold: "text-cyan-500 dark:text-cyan-400",
    freezing: "text-indigo-500 dark:text-indigo-400",
  },
  condition: {
    sunny: "text-yellow-500 dark:text-yellow-400",
    cloudy: "text-gray-500 dark:text-gray-400",
    rainy: "text-blue-500 dark:text-blue-400",
    snowy: "text-cyan-500 dark:text-cyan-400",
    stormy: "text-purple-500 dark:text-purple-400",
  },
  background: {
    video: "absolute inset-0 w-full h-full object-cover -z-10",
    overlay: "absolute inset-0 bg-black/20 dark:bg-black/40 -z-10",
  },
  // Add missing forecast styles
  forecastDay: `${COLORS.glass.interactive} rounded-lg p-3 hover:scale-[1.02] transition-transform`,
};

// Music-specific design tokens
export const MUSIC_STYLES = {
  player: {
    controls: `${COLORS.glass.floating} rounded-full`,
    progress: `${COLORS.glass.sliderTrack} rounded-full`,
    knob: `${COLORS.glass.sliderKnob} rounded-full`,
  },
  queue: {
    item: `${COLORS.glass.interactive} hover:scale-[1.02] ${ANIMATIONS.transition.default}`,
    playing: `${COLORS.glass.enhanced} border-blue-500/50`,
  },
  album: {
    art: "rounded-lg shadow-lg",
    placeholder:
      "bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700",
  },
};

// Responsive utilities
export const RESPONSIVE = {
  hide: {
    mobile: "hidden md:block",
    tablet: "hidden lg:block",
    desktop: "block lg:hidden",
  },
  show: {
    mobile: "block md:hidden",
    tablet: "hidden md:block lg:hidden",
    desktop: "hidden lg:block",
  },
  text: {
    responsive: "text-sm md:text-base lg:text-lg",
    title: "text-2xl md:text-3xl lg:text-4xl",
    subtitle: "text-lg md:text-xl",
  },
};

// Accessibility utilities
export const A11Y = {
  srOnly: "sr-only",
  focusVisible:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
  highContrast:
    "contrast-more:border-black contrast-more:text-black dark:contrast-more:border-white dark:contrast-more:text-white",
  reduceMotion: "motion-reduce:transition-none motion-reduce:animate-none",
};

// Export convenience functions
export const combineStyles = (...styles: string[]) => styles.join(" ");
export const conditionalStyle = (
  condition: boolean,
  trueStyle: string,
  falseStyle = "",
) => (condition ? trueStyle : falseStyle);

// Liquid Glass Utility Styles - Direct exports for components
export const LIQUID_GLASS_STYLES = {
  base: COLORS.glass.interactive,
  enhanced: COLORS.glass.enhanced,
  floating: COLORS.glass.floating,
  modal: COLORS.glass.modal,
  sidebar: COLORS.glass.sidebar,
  chromatic: COLORS.glass.chromatic,
  button: `${COLORS.glass.enhanced} hover:scale-[1.02] active:scale-[0.98] focus:ring-white/20`,
  card: `${COLORS.glass.interactive} rounded-lg`,
  container: `${COLORS.glass.interactive} rounded-lg p-6`,
  // Add missing styles for liquid glass container
  mouseResponsive: `${COLORS.glass.interactive} hover:scale-[1.01] transition-transform`,
  chromaticGlass: COLORS.glass.chromatic,
  elasticContainer: `${COLORS.glass.enhanced} transform transition-all duration-200`,
  interactiveGlass: `${COLORS.glass.interactive} hover:backdrop-saturate-[2.0]`,
};

// Liquid Glass Factory Functions
export const createLiquidGlassButton = (
  variant: "primary" | "secondary" | "ghost" = "primary",
) => {
  const baseStyles = `${BUTTON_STYLES.base} ${COLORS.glass.interactive}`;

  switch (variant) {
    case "primary":
      return `${baseStyles} ${COLORS.text.primary} hover:scale-[1.02] active:scale-[0.98]`;
    case "secondary":
      return `${baseStyles} ${COLORS.text.secondary} hover:scale-[1.02] active:scale-[0.98]`;
    case "ghost":
      return `${baseStyles} bg-transparent hover:bg-white/[0.05] dark:hover:bg-black/[0.05]`;
    default:
      return baseStyles;
  }
};

export const createLiquidGlassCard = (
  variant: "default" | "elevated" | "floating" = "default",
) => {
  const baseCard = `${CARD_STYLES.base}`;

  switch (variant) {
    case "elevated":
      return `${baseCard} ${COLORS.glass.floating}`;
    case "floating":
      return `${baseCard} ${COLORS.glass.floating} shadow-2xl`;
    default:
      return `${baseCard} ${COLORS.glass.interactive}`;
  }
};

// Helper function for creating error weather data (missing from hooks)
export const createErrorWeatherData = (error: string) => ({
  location: "Unknown Location",
  temperature: 0,
  condition: "Error",
  humidity: 0,
  windSpeed: 0,
  pressure: 0,
  visibility: 0,
  uvIndex: 0,
  feelsLike: 0,
  dewPoint: 0,
  icon: "error",
  description: error,
  sunrise: "",
  sunset: "",
  moonPhase: "",
  airQuality: {
    index: 0,
    category: "Unknown",
    pollutants: {},
  },
  alerts: [],
  lastUpdated: new Date().toISOString(),
});
