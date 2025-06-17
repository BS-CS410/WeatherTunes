/**
 * Unified Design System
 *
 * Single source of truth for all component styling.
 * Eliminates scattered style definitions and ensures consistency.
 */

// === DESIGN TOKENS ===

// Color system with semantic naming
export const COLORS = {
  // Glass morphism backgrounds
  glass: {
    light: "bg-white/40 backdrop-blur-md",
    dark: "dark:bg-slate-900/75",
    interactive: "hover:bg-white/50 dark:hover:bg-slate-900/60",
    modal: "bg-white/40 backdrop-blur-md dark:bg-slate-900/75",
  },

  // Text colors with consistent hierarchy
  text: {
    primary: "text-gray-900 dark:text-slate-100",
    secondary: "text-gray-700 dark:text-slate-300",
    muted: "text-gray-600 dark:text-slate-400",
    interactive: "hover:text-gray-900 dark:hover:text-slate-100",
    weather: "text-gray-900 drop-shadow-lg dark:text-cyan-50",
    condition: "text-gray-800 dark:text-cyan-100",
  },

  // Border and divider colors
  border: {
    light: "border-white/20",
    dark: "dark:border-white/10",
    interactive: "hover:border-white/30 dark:hover:border-white/20",
    subtle: "border-gray-300/40 dark:border-slate-600",
  },
} as const;

// Typography with consistent hierarchy
export const TYPOGRAPHY = {
  // Display text (large headings)
  display: {
    xl: "text-5xl font-extralight tracking-wider lowercase",
    lg: "text-3xl font-semibold tracking-wider uppercase",
    md: "text-2xl font-bold",
  },

  // Body text
  body: {
    lg: "text-lg font-medium",
    base: "text-base",
    sm: "text-sm",
    xs: "text-xs",
  },

  // Special purpose typography
  weather: {
    location:
      "font-inter-tight text-[1em] leading-[1.2] font-semibold tracking-wider uppercase",
    temperature: "font-inter-tight text-[5em] leading-[0.85] font-bold",
    condition:
      "font-inter-tight text-[1.3em] leading-[1.1] font-extralight tracking-tighter lowercase",
    time: "font-inter-tight leading-none font-light tracking-wider whitespace-nowrap",
  },

  // Music typography
  music: {
    title: "text-[1.4em] leading-[1.1] font-medium tracking-tight",
    artist: "text-[1em] leading-[1.3] font-light opacity-90",
  },
} as const;

// Animation and transition system
export const ANIMATIONS = {
  // Standard transitions
  transition: {
    fast: "transition-all duration-200 ease-out",
    standard: "transition-all duration-300 ease-out",
    slow: "transition-all duration-500 ease-out",
  },

  // Hover transformations
  hover: {
    subtle: "hover:-translate-y-1 hover:scale-[1.02]",
    standard: "hover:-translate-y-2 hover:scale-105",
    enhanced: "hover:-translate-y-3 hover:scale-110",
  },

  // Group hover effects
  groupHover: {
    subtle: "group-hover:-translate-y-1 group-hover:scale-[1.02]",
    standard: "group-hover:-translate-y-2 group-hover:scale-105",
    enhanced: "group-hover:-translate-y-3 group-hover:scale-110",
  },

  // Shadow effects
  shadow: {
    base: "drop-shadow-lg",
    hover: "hover:drop-shadow-xl",
    groupHover: "group-hover:drop-shadow-xl",
  },
} as const;

// Layout system for consistent spacing
export const LAYOUT = {
  // Container patterns
  container: {
    center: "flex items-center justify-center",
    column: "flex flex-col",
    row: "flex flex-row",
    grid: "grid",
  },

  // Spacing scale (includes legacy space-* patterns)
  spacing: {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
    // Legacy vertical spacing
    spaceY: {
      sm: "space-y-2",
      md: "space-y-4",
      lg: "space-y-6",
    },
    // Legacy horizontal spacing
    spaceX: {
      sm: "space-x-2",
      md: "space-x-4",
      lg: "space-x-6",
    },
    // Micro gaps for tight layouts
    micro: "gap-[2px]",
  },

  // Padding patterns (includes button-specific padding)
  padding: {
    none: "p-0",
    xs: "p-2",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
    // Button-specific padding patterns
    button: {
      sm: "px-4 py-2",
      md: "px-6 py-3",
      lg: "px-8 py-4",
    },
    // Legacy component-specific patterns
    section: {
      sm: "px-2 py-4",
      md: "px-4 pb-4 pl-2",
      lg: "p-8",
      queue: "px-4 pb-4 pl-6", // Specific to queue components
    },
  },

  // Rounded corners
  rounded: {
    sm: "rounded-md",
    base: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  },
} as const;

// === COMPONENT STYLE BUILDERS ===

// Glass card variants
export const CARD_STYLES = {
  base: [
    COLORS.glass.light,
    COLORS.glass.dark,
    COLORS.border.light,
    COLORS.border.dark,
    LAYOUT.rounded.lg,
    "border shadow-lg",
    ANIMATIONS.transition.standard,
  ].join(" "),

  interactive: [
    COLORS.glass.light,
    COLORS.glass.dark,
    COLORS.glass.interactive,
    COLORS.border.light,
    COLORS.border.dark,
    COLORS.border.interactive,
    LAYOUT.rounded.lg,
    "border shadow-lg",
    ANIMATIONS.transition.standard,
    ANIMATIONS.hover.subtle,
    ANIMATIONS.shadow.hover,
  ].join(" "),

  modal: [
    COLORS.glass.modal,
    COLORS.border.light,
    COLORS.border.dark,
    LAYOUT.rounded.lg,
    "border shadow-xl",
  ].join(" "),
} as const;

// Button variants
export const BUTTON_STYLES = {
  primary: [
    "bg-slate-600/70 text-white",
    "hover:bg-slate-700/80",
    "dark:bg-slate-500/60 dark:hover:bg-slate-600/70",
    ANIMATIONS.transition.fast,
  ].join(" "),

  secondary: [
    COLORS.border.subtle,
    "bg-white/30 text-gray-700 backdrop-blur-sm",
    "hover:bg-white/50 hover:text-gray-900",
    "dark:bg-slate-800/80 dark:text-slate-300",
    "dark:hover:bg-slate-700/80 dark:hover:text-slate-200",
    "border",
    ANIMATIONS.transition.fast,
  ].join(" "),

  // Legacy glass morphism style from original components
  glassButton: [
    "rounded-lg bg-white/40 font-medium text-gray-900 shadow-md backdrop-blur-md",
    "transition-all duration-200 hover:bg-white/60 hover:shadow-lg",
    "dark:bg-slate-900/75 dark:text-slate-100 dark:hover:bg-slate-900/90",
    LAYOUT.padding.button.md,
  ].join(" "),

  ghost: [
    "bg-transparent",
    COLORS.text.secondary,
    COLORS.text.interactive,
    ANIMATIONS.transition.fast,
  ].join(" "),
} as const;

// Input field styles
export const INPUT_STYLES = {
  base: [
    COLORS.glass.light,
    COLORS.glass.dark,
    COLORS.border.light,
    COLORS.border.dark,
    COLORS.text.primary,
    "border",
    LAYOUT.rounded.base,
    LAYOUT.padding.sm,
    ANIMATIONS.transition.fast,
    "focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
  ].join(" "),
} as const;

// Music component specific styles
export const MUSIC_STYLES = {
  // Album art container
  albumContainer: [
    "relative overflow-hidden",
    LAYOUT.rounded.lg,
    ANIMATIONS.transition.standard,
    ANIMATIONS.groupHover.enhanced,
    ANIMATIONS.shadow.groupHover,
    "group/album",
  ].join(" "),

  // Track info layout
  trackInfo: [LAYOUT.container.column, LAYOUT.spacing.sm, "text-center"].join(
    " ",
  ),

  // Queue item
  queueItem: [
    CARD_STYLES.interactive,
    LAYOUT.container.row,
    LAYOUT.spacing.sm,
    LAYOUT.padding.sm,
    "cursor-pointer group",
  ].join(" "),
} as const;

// Weather component specific styles
export const WEATHER_STYLES = {
  // Main weather display
  display: [
    "grid aspect-[2/1] h-full w-full grid-cols-2 grid-rows-1",
    "text-[clamp(1rem,3.5vw,1.6rem)]",
  ].join(" "),

  // Weather section
  section: [
    "relative",
    LAYOUT.container.column,
    "items-start justify-center",
  ].join(" "),

  // Forecast day item
  forecastDay: [
    "group grid grid-rows-[auto_auto_3rem_2rem_auto]",
    "items-center justify-items-center",
    LAYOUT.spacing.xs,
    LAYOUT.rounded.base,
    COLORS.border.light,
    COLORS.border.dark,
    "border bg-white/10 backdrop-blur-sm",
    "dark:bg-slate-800/20",
    LAYOUT.padding.sm,
    "text-center",
    ANIMATIONS.transition.standard,
    ANIMATIONS.hover.standard,
    COLORS.border.interactive,
    "hover:bg-white/20 dark:hover:bg-slate-700/30",
  ].join(" "),
} as const;

// Utility for combining styles
export const combineStyles = (
  ...styles: (string | undefined | null | false)[]
): string => {
  return styles.filter(Boolean).join(" ");
};

// Helper for conditional styles
export const conditionalStyle = (
  condition: boolean,
  trueStyle: string,
  falseStyle = "",
): string => {
  return condition ? trueStyle : falseStyle;
};
