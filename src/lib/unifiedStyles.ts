/**
 * Unified Design System
 *
 * Single source of truth for all component styling.
 * Eliminates scattered style definitions and ensures consistency.
 */

// === DESIGN TOKENS ===

// Color system with semantic naming
export const COLORS = {
  // Liquid Glass backgrounds - inspired by Apple's design with gentle, soft appearance
  glass: {
    light:
      "bg-white/[0.06] backdrop-blur-xl backdrop-saturate-[1.6] border border-white/[0.15]",
    dark: "dark:bg-white/[0.04] dark:backdrop-blur-xl dark:backdrop-saturate-[1.6] dark:border-white/[0.08]",
    interactive:
      "hover:bg-white/[0.08] hover:border-white/[0.2] dark:hover:bg-white/[0.06] dark:hover:border-white/[0.12]",
    modal:
      "bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-[1.7] border border-white/[0.18] dark:bg-white/[0.05] dark:border-white/[0.1]",
    // Enhanced liquid glass for prominent controls with gentle Apple-style depth
    enhanced:
      "bg-white/[0.07] backdrop-blur-xl backdrop-saturate-[1.6] border border-white/[0.18] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] dark:bg-white/[0.05] dark:border-white/[0.1] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
    // Segmented control style matching Apple's design with very subtle depth
    segmented:
      "bg-white/[0.05] backdrop-blur-xl backdrop-saturate-[1.6] border border-white/[0.12] shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.15)] dark:bg-white/[0.03] dark:border-white/[0.06] dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.08)]",
    segmentedActive:
      "bg-white/[0.85] backdrop-blur-sm border border-white/[0.3] shadow-[0_0.5px_2px_rgba(0,0,0,0.08)] dark:bg-white/[0.15] dark:border-white/[0.2] dark:shadow-[0_0.5px_2px_rgba(0,0,0,0.2)]",
    // Slider track and knob styles - softer approach
    sliderTrack:
      "bg-white/[0.1] backdrop-blur-md border border-white/[0.15] dark:bg-white/[0.06] dark:border-white/[0.08]",
    sliderKnob:
      "bg-white/[0.9] backdrop-blur-sm border border-white/[0.4] shadow-[0_1px_4px_rgba(0,0,0,0.1)] dark:bg-white/[0.8] dark:border-white/[0.3] dark:shadow-[0_1px_4px_rgba(0,0,0,0.25)]",
  },

  // Text colors with consistent hierarchy
  text: {
    primary: "text-gray-950 dark:text-white",
    secondary: "text-gray-800 dark:text-gray-200",
    muted: "text-gray-700 dark:text-gray-300",
    interactive: "hover:text-gray-950 dark:hover:text-white",
    weather: "text-gray-950 drop-shadow-lg dark:text-white",
    condition: "text-gray-900 dark:text-gray-100",
    onGlass: "text-gray-900 dark:text-white drop-shadow-sm",
  },

  // Border and divider colors with gentle liquid glass styling
  border: {
    light: "border-white/12",
    dark: "dark:border-white/06",
    interactive: "hover:border-white/18 dark:hover:border-white/10",
    subtle: "border-white/08 dark:border-white/04",
    enhanced: "border-white/15 dark:border-white/08",
  },

  // Shadow system for gentle liquid glass depth
  shadow: {
    glass:
      "shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.2)]",
    glassHover:
      "shadow-[0_6px_25px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_6px_25px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.25)]",
    inset:
      "shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2)] dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.1)]",
    // Gentle depth for controls
    control:
      "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.15)]",
    controlHover:
      "shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.25),0_4px_12px_rgba(0,0,0,0.18)]",
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
  // Standard transitions with liquid glass easing
  transition: {
    fast: "transition-all duration-200 ease-out",
    standard: "transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    liquid:
      "transition-all duration-400 cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },

  // Hover transformations
  hover: {
    subtle: "hover:-translate-y-1 hover:scale-[1.02]",
    standard: "hover:-translate-y-2 hover:scale-105",
    enhanced: "hover:-translate-y-3 hover:scale-110",
    liquid: "hover:-translate-y-1 hover:scale-[1.01]",
  },

  // Group hover effects
  groupHover: {
    subtle: "group-hover:-translate-y-1 group-hover:scale-[1.02]",
    standard: "group-hover:-translate-y-2 group-hover:scale-105",
    enhanced: "group-hover:-translate-y-3 group-hover:scale-110",
    liquid: "group-hover:-translate-y-1 group-hover:scale-[1.01]",
  },

  // Shadow effects
  shadow: {
    base: "drop-shadow-lg",
    hover: "hover:drop-shadow-xl",
    groupHover: "group-hover:drop-shadow-xl",
  },

  // Liquid Glass specific animations
  liquidGlass: {
    morph: "animate-liquid-morph",
    breathe: "animate-liquid-breathe",
    shimmer: "animate-liquid-shimmer",
    hover: "liquid-glass-hover",
    interactive: "liquid-glass-interactive",
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

  // Rounded corners - Apple Liquid Glass inspired with generous rounding
  rounded: {
    sm: "rounded-lg", // More rounded for small elements
    base: "rounded-xl", // 0.75rem -> 1rem for softer appearance
    lg: "rounded-2xl", // 1.5rem - much more rounded for larger elements
    xl: "rounded-3xl", // 1.75rem - very rounded for prominent elements
    full: "rounded-full",
  },
} as const;

// === COMPONENT STYLE BUILDERS ===

// Glass card variants - Liquid Glass inspired with subtle white outline
export const CARD_STYLES = {
  base: [
    COLORS.glass.light,
    COLORS.glass.dark,
    LAYOUT.rounded.base,
    COLORS.shadow.glass,
    ANIMATIONS.transition.standard,
  ].join(" "),

  interactive: [
    COLORS.glass.light,
    COLORS.glass.dark,
    COLORS.glass.interactive,
    LAYOUT.rounded.base,
    COLORS.shadow.glass,
    "hover:" + COLORS.shadow.glassHover.replace("shadow-", ""),
    ANIMATIONS.transition.liquid,
    ANIMATIONS.hover.liquid,
    ANIMATIONS.liquidGlass.hover,
  ].join(" "),

  // Enhanced card for prominent elements with Apple-style depth
  enhanced: [
    COLORS.glass.enhanced,
    LAYOUT.rounded.lg,
    COLORS.shadow.control,
    ANIMATIONS.transition.standard,
    ANIMATIONS.liquidGlass.breathe,
  ].join(" "),

  // Segmented control style with refined appearance
  segmented: [
    COLORS.glass.segmented,
    LAYOUT.rounded.base,
    COLORS.shadow.glass,
    ANIMATIONS.transition.fast,
    "p-2", // Container padding for segmented controls
  ].join(" "),

  segmentedActive: [
    COLORS.glass.segmentedActive,
    LAYOUT.rounded.base,
    COLORS.shadow.control,
    ANIMATIONS.transition.fast,
  ].join(" "),

  // Morphing card for dynamic elements
  morphing: [
    COLORS.glass.enhanced,
    LAYOUT.rounded.base,
    COLORS.shadow.glass,
    ANIMATIONS.transition.liquid,
    ANIMATIONS.liquidGlass.morph,
  ].join(" "),

  modal: [
    COLORS.glass.modal,
    LAYOUT.rounded.lg,
    "shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]",
  ].join(" "),
} as const;

// Button variants - Apple Liquid Glass inspired with gentle, soft appearance
export const BUTTON_STYLES = {
  primary: [
    "bg-blue-500/[0.7] backdrop-blur-xl backdrop-saturate-[1.5]",
    "border border-blue-400/[0.2] text-white font-medium",
    "hover:bg-blue-600/[0.90] hover:border-blue-400/[0.35] hover:backdrop-saturate-[1.7]",
    "hover:shadow-[0_2px_12px_rgba(0,0,0,0.18)]",
    "dark:bg-blue-500/[0.6] dark:border-blue-400/[0.15]",
    "dark:hover:bg-blue-600/[0.80] dark:hover:border-blue-400/[0.3]",
    LAYOUT.rounded.base,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.liquid,
    ANIMATIONS.liquidGlass.interactive,
    COLORS.shadow.control,
    "hover:" + COLORS.shadow.controlHover.replace("shadow-", ""),
  ].join(" "),

  secondary: [
    COLORS.glass.enhanced,
    COLORS.text.onGlass,
    "font-medium",
    LAYOUT.rounded.base,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.liquid,
    ANIMATIONS.liquidGlass.interactive,
    "hover:bg-white/[0.18] hover:border-white/[0.28]",
    "hover:shadow-[0_2px_12px_rgba(0,0,0,0.16)]",
    "dark:hover:bg-white/[0.13] dark:hover:border-white/[0.18]",
    COLORS.shadow.control,
    "hover:" + COLORS.shadow.controlHover.replace("shadow-", ""),
  ].join(" "),

  liquidGlass: [
    COLORS.glass.enhanced,
    COLORS.text.onGlass,
    "font-medium",
    LAYOUT.rounded.base,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.liquid,
    ANIMATIONS.liquidGlass.hover,
    ANIMATIONS.liquidGlass.shimmer,
    "hover:bg-white/[0.18] hover:border-white/[0.55]",
    "dark:hover:bg-white/[0.15] dark:hover:border-white/[0.4]",
    COLORS.shadow.control,
    "hover:" + COLORS.shadow.controlHover.replace("shadow-", ""),
  ].join(" "),

  ghost: [
    "bg-transparent border border-transparent",
    COLORS.text.secondary,
    COLORS.text.interactive,
    "font-medium",
    LAYOUT.rounded.base,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.liquid,
    ANIMATIONS.liquidGlass.interactive,
    "hover:bg-white/20 hover:border-white/30 hover:backdrop-blur-xl hover:backdrop-saturate-150",
    "hover:shadow-[0_2px_12px_rgba(0,0,0,0.14)]",
    "dark:hover:bg-white/12 dark:hover:border-white/18",
    "hover:" + COLORS.shadow.glass.replace("shadow-", ""),
  ].join(" "),

  // Segmented control button styles - Apple-style with gentle, soft appearance
  segmented: [
    "bg-transparent border-0",
    COLORS.text.onGlass,
    "font-medium px-5 py-2.5",
    LAYOUT.rounded.base,
    ANIMATIONS.transition.fast,
    "hover:bg-white/[0.04] dark:hover:bg-white/[0.02]",
  ].join(" "),

  segmentedActive: [
    COLORS.glass.segmentedActive,
    COLORS.text.onGlass,
    "font-semibold px-5 py-2.5",
    LAYOUT.rounded.base,
    ANIMATIONS.transition.fast,
    COLORS.shadow.control,
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
    "bg-white/[0.12] backdrop-blur-2xl backdrop-saturate-[2.0]",
    "dark:bg-slate-900/[0.7] dark:backdrop-blur-2xl dark:backdrop-saturate-[2.0]",
    "shadow-[0_20px_50px_rgb(0,0,0,0.12),0_1px_3px_rgb(0,0,0,0.1)] border border-white/[0.35]",
    "dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] dark:border-white/[0.2]",
    LAYOUT.rounded.lg,
  ].join(" "),

  // Sidebar or panel elements
  panel: [
    "bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-[1.8]",
    "dark:bg-slate-900/[0.6] dark:backdrop-blur-2xl dark:backdrop-saturate-[1.8]",
    "shadow-[0_12px_40px_rgb(0,0,0,0.1),0_1px_3px_rgb(0,0,0,0.08)]",
    "dark:shadow-[0_12px_40px_rgb(0,0,0,0.35)]",
    "border border-white/[0.3] dark:border-white/[0.15]",
    LAYOUT.rounded.lg,
  ].join(" "),

  // Overlay backgrounds
  overlay: [
    "bg-white/[0.05] backdrop-blur-3xl backdrop-saturate-[2.2]",
    "dark:bg-slate-900/[0.4] dark:backdrop-blur-3xl dark:backdrop-saturate-[2.2]",
  ].join(" "),

  // Slider components inspired by Apple's design
  slider: {
    track: [
      COLORS.glass.sliderTrack,
      "h-2 rounded-full relative overflow-hidden",
      COLORS.shadow.glass,
    ].join(" "),

    thumb: [
      COLORS.glass.sliderKnob,
      "w-6 h-6 rounded-full cursor-pointer",
      "transition-all duration-200 ease-out",
      "hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]",
      "active:scale-105",
    ].join(" "),

    range: [
      "bg-blue-500/[0.9] h-full rounded-full",
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]",
    ].join(" "),
  },

  // Segmented control container
  segmentedControl: [
    COLORS.glass.segmented,
    "flex p-1 rounded-xl",
    COLORS.shadow.glass,
    "gap-1",
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
