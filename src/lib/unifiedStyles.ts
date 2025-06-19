/**
 * Unified Design System
 *
 * Single source of truth for all component styling.
 * Eliminates scattered style definitions and ensures consistency.
 */

// === DESIGN TOKENS ===

// Color system with semantic naming
export const COLORS = {
  // Liquid Glass backgrounds - inspired by Apple's design
  glass: {
    light: "bg-white/8 backdrop-blur-xl backdrop-saturate-150",
    dark: "dark:bg-slate-900/60 dark:backdrop-blur-xl dark:backdrop-saturate-150",
    interactive: "hover:bg-white/12 dark:hover:bg-slate-900/70",
    modal:
      "bg-white/15 backdrop-blur-2xl backdrop-saturate-200 dark:bg-slate-900/80",
  },

  // Text colors with consistent hierarchy
  text: {
    primary: "text-gray-950 dark:text-slate-100",
    secondary: "text-gray-800 dark:text-slate-300",
    muted: "text-gray-700 dark:text-slate-400",
    interactive: "hover:text-gray-950 dark:hover:text-slate-100",
    weather: "text-gray-950 drop-shadow-lg dark:text-cyan-50",
    condition: "text-gray-900 dark:text-cyan-100",
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

// Glass card variants - Liquid Glass inspired
export const CARD_STYLES = {
  base: [
    COLORS.glass.light,
    COLORS.glass.dark,
    LAYOUT.rounded.lg,
    // Liquid Glass shadow with multiple layers for depth
    "shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
    ANIMATIONS.transition.standard,
  ].join(" "),

  interactive: [
    COLORS.glass.light,
    COLORS.glass.dark,
    COLORS.glass.interactive,
    LAYOUT.rounded.lg,
    // Enhanced shadow for interactive elements
    "shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.16)]",
    "dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] dark:hover:shadow-[0_16px_40px_rgb(0,0,0,0.6)]",
    ANIMATIONS.transition.standard,
    ANIMATIONS.hover.subtle,
  ].join(" "),

  modal: [
    COLORS.glass.modal,
    COLORS.border.light,
    COLORS.border.dark,
    LAYOUT.rounded.lg,
    "border shadow-[0_20px_50px_rgb(0,0,0,0.25)]",
  ].join(" "),
} as const;

// Button variants - Apple-inspired, unified single source of truth
export const BUTTON_STYLES = {
  primary: [
    COLORS.glass.light,
    COLORS.glass.dark,
    "bg-blue-500/90 dark:bg-blue-500/80 text-white font-medium",
    "hover:bg-blue-600/90 dark:hover:bg-blue-600/80 hover:backdrop-saturate-180",
    LAYOUT.rounded.lg,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.fast,
    // Unified shadow
    "shadow-[0_1px_3px_rgb(0,0,0,0.1),0_4px_14px_rgb(59,130,246,0.15)] hover:shadow-[0_2px_6px_rgb(0,0,0,0.12),0_8px_20px_rgb(59,130,246,0.2)]",
    "dark:shadow-[0_1px_3px_rgb(0,0,0,0.3),0_4px_14px_rgb(59,130,246,0.2)] dark:hover:shadow-[0_2px_6px_rgb(0,0,0,0.4),0_8px_20px_rgb(59,130,246,0.25)]",
  ].join(" "),

  secondary: [
    COLORS.glass.light,
    COLORS.glass.dark,
    COLORS.text.primary,
    "font-medium",
    LAYOUT.rounded.lg,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.fast,
    "hover:bg-white/25 dark:hover:bg-gray-700/50 hover:backdrop-saturate-180",
    // Unified shadow
    "shadow-[0_1px_2px_rgb(0,0,0,0.05),0_2px_8px_rgb(0,0,0,0.08)] hover:shadow-[0_1px_3px_rgb(0,0,0,0.08),0_4px_12px_rgb(0,0,0,0.12)]",
    "dark:shadow-[0_1px_2px_rgb(0,0,0,0.2),0_2px_8px_rgb(0,0,0,0.25)] dark:hover:shadow-[0_1px_3px_rgb(0,0,0,0.3),0_4px_12px_rgb(0,0,0,0.35)]",
    // Unified border
    COLORS.border.light,
    COLORS.border.dark,
    "hover:border-white/15 dark:hover:border-gray-500/40",
  ].join(" "),

  liquidGlass: [
    COLORS.glass.light,
    COLORS.glass.dark,
    COLORS.text.primary,
    "font-medium",
    LAYOUT.rounded.lg,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.standard,
    "hover:bg-white/20 dark:hover:bg-gray-600/40 hover:backdrop-saturate-200",
    // Unified shadow
    "shadow-[0_1px_3px_rgb(0,0,0,0.08),0_4px_16px_rgb(0,0,0,0.12)] hover:shadow-[0_2px_6px_rgb(0,0,0,0.12),0_8px_24px_rgb(0,0,0,0.16)]",
    "dark:shadow-[0_1px_3px_rgb(0,0,0,0.25),0_4px_16px_rgb(0,0,0,0.35)] dark:hover:shadow-[0_2px_6px_rgb(0,0,0,0.35),0_8px_24px_rgb(0,0,0,0.45)]",
    // Unified border
    COLORS.border.light,
    COLORS.border.dark,
    "hover:border-white/25 dark:hover:border-gray-400/40",
  ].join(" "),

  ghost: [
    "bg-transparent",
    COLORS.text.secondary,
    COLORS.text.interactive,
    "font-medium",
    LAYOUT.rounded.lg,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.fast,
    "hover:bg-white/8 dark:hover:bg-gray-800/30 hover:backdrop-blur-sm hover:backdrop-saturate-150",
    "hover:shadow-[0_1px_2px_rgb(0,0,0,0.05),0_2px_8px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_1px_2px_rgb(0,0,0,0.2),0_2px_8px_rgb(0,0,0,0.25)]",
  ].join(" "),

  icon: [
    COLORS.glass.light,
    COLORS.glass.dark,
    COLORS.text.primary,
    "font-medium",
    LAYOUT.rounded.lg,
    "p-3",
    ANIMATIONS.transition.fast,
    "hover:bg-white/18 dark:hover:bg-gray-600/40 hover:backdrop-saturate-180",
    "shadow-[0_1px_2px_rgb(0,0,0,0.08),0_2px_8px_rgb(0,0,0,0.12)] hover:shadow-[0_1px_3px_rgb(0,0,0,0.12),0_4px_12px_rgb(0,0,0,0.16)]",
    "dark:shadow-[0_1px_2px_rgb(0,0,0,0.25),0_2px_8px_rgb(0,0,0,0.3)] dark:hover:shadow-[0_1px_3px_rgb(0,0,0,0.35),0_4px_12px_rgb(0,0,0,0.4)]",
    COLORS.border.light,
    COLORS.border.dark,
    "hover:border-white/20 dark:hover:border-gray-500/35",
  ].join(" "),

  // Subtle glassy selected state for button groups
  selectedGlass: [
    COLORS.glass.light,
    COLORS.glass.dark,
    "bg-white/25 dark:bg-slate-800/40 backdrop-blur-md backdrop-saturate-150",
    COLORS.text.primary,
    LAYOUT.rounded.lg,
    LAYOUT.padding.button.sm,
    "ring-2 ring-white/30 dark:ring-slate-400/30",
    "shadow-[0_2px_8px_rgb(0,0,0,0.10)] dark:shadow-[0_2px_8px_rgb(0,0,0,0.25)]",
    ANIMATIONS.transition.fast,
    COLORS.border.light,
    COLORS.border.dark,
  ].join(" "),
} as const;

// Input field styles - Liquid Glass enhanced
export const INPUT_STYLES = {
  base: [
    COLORS.glass.light,
    COLORS.glass.dark,
    COLORS.text.primary,
    LAYOUT.rounded.base,
    LAYOUT.padding.sm,
    // Liquid Glass input styling
    "shadow-[inset_0_2px_4px_rgb(0,0,0,0.06)] focus:shadow-[inset_0_2px_4px_rgb(0,0,0,0.1)]",
    "dark:shadow-[inset_0_2px_4px_rgb(0,0,0,0.2)] dark:focus:shadow-[inset_0_2px_4px_rgb(0,0,0,0.3)]",
    "placeholder:text-gray-500 dark:placeholder:text-slate-400",
    ANIMATIONS.transition.fast,
    "focus:bg-white/12 dark:focus:bg-slate-900/70",
    "focus:backdrop-saturate-200",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/30",
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

// Weather component specific styles - Liquid Glass enhanced
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

  // Forecast day item - Liquid Glass styling
  forecastDay: [
    "group grid grid-rows-[auto_auto_3rem_2rem_auto]",
    "items-center justify-items-center",
    LAYOUT.spacing.xs,
    LAYOUT.rounded.base,
    // Liquid Glass background for forecast items
    "bg-white/6 backdrop-blur-lg backdrop-saturate-150",
    "dark:bg-slate-800/30 dark:backdrop-blur-lg dark:backdrop-saturate-150",
    LAYOUT.padding.sm,
    "text-center",
    ANIMATIONS.transition.standard,
    // Enhanced hover for liquid glass
    "hover:bg-white/10 hover:backdrop-saturate-200 hover:-translate-y-1",
    "dark:hover:bg-slate-700/40 dark:hover:backdrop-saturate-200",
    "shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.12)]",
    "dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] dark:hover:shadow-[0_8px_25px_rgb(0,0,0,0.3)]",
  ].join(" "),
} as const;

// Liquid Glass specific component styles
export const LIQUID_GLASS_STYLES = {
  // Floating elements like tooltips, dropdowns
  floating: [
    "bg-white/12 backdrop-blur-2xl backdrop-saturate-200",
    "dark:bg-slate-900/70 dark:backdrop-blur-2xl dark:backdrop-saturate-200",
    "shadow-[0_20px_50px_rgb(0,0,0,0.15)] border border-white/20",
    "dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] dark:border-white/10",
    LAYOUT.rounded.lg,
  ].join(" "),

  // Sidebar or panel elements
  panel: [
    "bg-white/10 backdrop-blur-xl backdrop-saturate-150",
    "dark:bg-slate-900/60 dark:backdrop-blur-xl dark:backdrop-saturate-150",
    "shadow-[0_12px_40px_rgb(0,0,0,0.12)]",
    "dark:shadow-[0_12px_40px_rgb(0,0,0,0.4)]",
    LAYOUT.rounded.lg,
  ].join(" "),

  // Overlay backgrounds
  overlay: [
    "bg-white/5 backdrop-blur-3xl backdrop-saturate-180",
    "dark:bg-slate-900/40 dark:backdrop-blur-3xl dark:backdrop-saturate-180",
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
