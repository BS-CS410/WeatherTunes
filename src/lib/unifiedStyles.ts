/**
 * Unified Design System - Enhanced with Advanced Liquid Glass Effects
 *
 * Single source of truth for all component styling.
 * Eliminates scattered style definitions and ensures consistency.
 * Now includes advanced liquid glass effects inspired by Apple's design.
 */

// === DESIGN TOKENS ===

// Color system with semantic naming - Enhanced Liquid Glass
export const COLORS = {
  // Advanced Liquid Glass backgrounds with enhanced depth and refraction
  glass: {
    // Primary liquid glass - ultra-soft with enhanced depth
    light:
      "bg-white/[0.05] backdrop-blur-xl backdrop-saturate-[1.8] border border-white/[0.12]",
    dark: "dark:bg-black/[0.12] dark:backdrop-blur-xl dark:backdrop-saturate-[1.6] dark:border-white/[0.04]",

    // Interactive states with dynamic enhancement
    interactive:
      "hover:bg-white/[0.08] hover:border-white/[0.18] hover:backdrop-saturate-[2.0] dark:hover:bg-black/[0.15] dark:hover:border-white/[0.06] dark:hover:backdrop-saturate-[1.8]",

    // Modal and overlay effects with maximum blur
    modal:
      "bg-white/[0.06] backdrop-blur-2xl backdrop-saturate-[2.2] border border-white/[0.15] dark:bg-black/[0.18] dark:border-white/[0.06]",

    // Enhanced liquid glass for prominent controls with Apple-style chromatic effects
    enhanced:
      "bg-white/[0.04] backdrop-blur-xl backdrop-saturate-[2.0] border border-white/[0.15] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),inset_0_0_20px_rgba(255,255,255,0.05)] dark:bg-black/[0.15] dark:border-white/[0.06] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),inset_0_0_20px_rgba(255,255,255,0.02)]",

    // Segmented control with liquid deformation
    segmented:
      "bg-white/[0.03] backdrop-blur-xl backdrop-saturate-[1.8] border border-white/[0.08] shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2)] dark:bg-black/[0.08] dark:border-white/[0.03] dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.06)]",
    segmentedActive:
      "bg-white/[0.90] backdrop-blur-sm border border-white/[0.35] shadow-[0_0.5px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] dark:bg-white/[0.15] dark:border-white/[0.18] dark:shadow-[0_0.5px_4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]",

    // Slider components with liquid glass aesthetic
    sliderTrack:
      "bg-white/[0.08] backdrop-blur-lg backdrop-saturate-[1.6] border border-white/[0.12] dark:bg-black/[0.12] dark:border-white/[0.04]",
    sliderKnob:
      "bg-white/[0.95] backdrop-blur-sm border border-white/[0.5] shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] dark:bg-white/[0.90] dark:border-white/[0.3] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]",

    // Hexagonal app icon style with liquid glass
    hexIcon:
      "bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-lg backdrop-saturate-[1.8] border border-white/[0.12] dark:from-black/[0.20] dark:to-black/[0.12] dark:border-white/[0.06]",

    // Sidebar with enhanced liquid glass
    sidebar:
      "bg-white/[0.06] backdrop-blur-xl backdrop-saturate-[1.8] border-r border-white/[0.12] dark:bg-black/[0.20] dark:border-white/[0.04]",

    // Floating elements with maximum glassmorphism
    floating:
      "bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-[2.4] border border-white/[0.25] shadow-[0_20px_50px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)] dark:bg-black/[0.25] dark:border-white/[0.15] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]",

    // Liquid glass with chromatic aberration simulation
    chromatic:
      "bg-white/[0.04] backdrop-blur-xl backdrop-saturate-[2.0] border border-white/[0.15] shadow-[inset_0_0_20px_rgba(255,255,255,0.05),inset_1px_0_0_rgba(255,0,0,0.02),inset_-1px_0_0_rgba(0,255,0,0.02),inset_0_1px_0_rgba(0,0,255,0.02)] dark:bg-black/[0.15] dark:border-white/[0.06] dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.02),inset_1px_0_0_rgba(255,0,0,0.01),inset_-1px_0_0_rgba(0,255,0,0.01),inset_0_1px_0_rgba(0,0,255,0.01)]",
  },

  // Text colors with consistent hierarchy
  text: {
    primary: "text-gray-950 dark:text-white",
    secondary: "text-gray-800 dark:text-gray-100",
    muted: "text-gray-700 dark:text-gray-200",
    interactive: "hover:text-gray-950 dark:hover:text-white",
    weather:
      "text-gray-950 drop-shadow-lg dark:text-white dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
    condition: "text-gray-900 dark:text-gray-50",
    onGlass: "text-gray-900 dark:text-white drop-shadow-sm",
    onDarkGlass: "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
    subtle: "text-gray-600 dark:text-gray-300",
    placeholder: "text-gray-500 dark:text-gray-400",
  },

  // Enhanced border system for liquid glass
  border: {
    light: "border-white/10",
    dark: "dark:border-white/04",
    interactive: "hover:border-white/20 dark:hover:border-white/08",
    subtle: "border-white/06 dark:border-white/02",
    enhanced: "border-white/15 dark:border-white/06",
    divider: "border-gray-300/30 dark:border-slate-400/15",
    // Liquid glass specific borders with chromatic hints
    liquidEdge:
      "border-white/[0.15] shadow-[inset_0_0_1px_rgba(255,255,255,0.3)]",
    liquidGlow: "border-white/[0.20] shadow-[0_0_10px_rgba(255,255,255,0.1)]",
  },

  // Enhanced shadow system with liquid glass depth
  shadow: {
    glass:
      "shadow-[0_8px_32px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.4)]",
    glassHover:
      "shadow-[0_12px_40px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.5)]",

    // Liquid glass specific shadows with chromatic aberration
    liquidGlass:
      "shadow-[0_8px_32px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.05)]",
    liquidHover:
      "shadow-[0_16px_48px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(255,255,255,0.15)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.08)]",

    // Displacement effect simulation
    displacement:
      "shadow-[0_0_20px_rgba(255,255,255,0.1),inset_0_0_20px_rgba(255,255,255,0.05)]",
    displacementHover:
      "shadow-[0_0_30px_rgba(255,255,255,0.15),inset_0_0_30px_rgba(255,255,255,0.08)]",

    inset:
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
    control:
      "shadow-[0_2px_8px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)]",
    controlHover:
      "shadow-[0_4px_12px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.25)]",
    darkGlow: "dark:shadow-[0_0_20px_rgba(255,255,255,0.05)]",
    darkInner: "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
  },
} as const;

// Enhanced animation system with liquid glass elasticity
export const ANIMATIONS = {
  // Liquid glass transitions with elastic bezier curves
  transition: {
    fast: "transition-all duration-200 ease-out",
    standard: "transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    liquid:
      "transition-all duration-400 cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    // Apple-style spring animations
    spring:
      "transition-all duration-600 cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "transition-all duration-800 cubic-bezier(0.68, -0.6, 0.32, 1.6)",
  },

  // Enhanced hover transformations with liquid elasticity
  hover: {
    subtle: "hover:-translate-y-1 hover:scale-[1.02]",
    standard: "hover:-translate-y-2 hover:scale-105",
    enhanced: "hover:-translate-y-3 hover:scale-110",
    liquid:
      "hover:-translate-y-1 hover:scale-[1.01] hover:backdrop-saturate-[2.2]",
    // Liquid glass specific hover with distortion simulation
    liquidGlass:
      "hover:-translate-y-2 hover:scale-[1.03] hover:backdrop-saturate-[2.4] hover:backdrop-blur-2xl",
    elastic: "hover:-translate-y-2 hover:scale-[1.05] hover:rotate-1",
  },

  // Group hover effects
  groupHover: {
    subtle: "group-hover:-translate-y-1 group-hover:scale-[1.02]",
    standard: "group-hover:-translate-y-2 group-hover:scale-105",
    enhanced: "group-hover:-translate-y-3 group-hover:scale-110",
    liquid: "group-hover:-translate-y-1 group-hover:scale-[1.01]",
    liquidGlass:
      "group-hover:-translate-y-2 group-hover:scale-[1.03] group-hover:backdrop-saturate-[2.4]",
  },

  // Shadow effects
  shadow: {
    base: "drop-shadow-lg",
    hover: "hover:drop-shadow-xl",
    groupHover: "group-hover:drop-shadow-xl",
    liquid: "drop-shadow-[0_8px_32px_rgba(0,0,0,0.06)]",
    liquidHover: "hover:drop-shadow-[0_16px_48px_rgba(0,0,0,0.1)]",
  },

  // Advanced Liquid Glass animations
  liquidGlass: {
    morph: "animate-liquid-morph",
    breathe: "animate-liquid-breathe",
    shimmer: "animate-liquid-shimmer",
    hover: "liquid-glass-hover",
    interactive: "liquid-glass-interactive",
    // Chromatic aberration simulation
    chromatic: "animate-chromatic-shift",
    // Elastic deformation on mouse interaction
    elastic: "animate-elastic-deform",
    // Displacement wave effect
    displacement: "animate-displacement-wave",
  },

  // CSS custom properties for dynamic effects
  dynamicEffects: {
    mouseTrack: "var(--mouse-x, 0) var(--mouse-y, 0)",
    elasticity: "var(--elasticity, 0.15)",
    displacement: "var(--displacement-scale, 70)",
    aberration: "var(--aberration-intensity, 2)",
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

// Advanced Liquid Glass card variants inspired by Apple's design
export const CARD_STYLES = {
  base: [
    COLORS.glass.light,
    COLORS.glass.dark,
    LAYOUT.rounded.base,
    COLORS.shadow.liquidGlass,
    ANIMATIONS.transition.standard,
  ].join(" "),

  interactive: [
    COLORS.glass.light,
    COLORS.glass.dark,
    COLORS.glass.interactive,
    LAYOUT.rounded.base,
    COLORS.shadow.liquidGlass,
    COLORS.shadow.liquidHover.replace("shadow-", "hover:shadow-"),
    ANIMATIONS.transition.liquid,
    "group",
  ].join(" "),

  // Enhanced card with maximum liquid glass effect
  enhanced: [
    COLORS.glass.enhanced,
    LAYOUT.rounded.lg,
    COLORS.shadow.liquidGlass,
    ANIMATIONS.transition.elastic,
    ANIMATIONS.liquidGlass.breathe,
    "relative overflow-hidden",
  ].join(" "),

  // Liquid glass with chromatic aberration simulation
  chromatic: [
    COLORS.glass.chromatic,
    LAYOUT.rounded.base,
    COLORS.shadow.liquidGlass,
    ANIMATIONS.transition.liquid,
    ANIMATIONS.liquidGlass.chromatic,
    "relative overflow-hidden",
  ].join(" "),

  // Floating element with maximum glassmorphism
  floating: [
    COLORS.glass.floating,
    LAYOUT.rounded.lg,
    COLORS.shadow.liquidHover,
    ANIMATIONS.transition.spring,
    "relative overflow-hidden",
  ].join(" "),

  // Segmented control with liquid glass aesthetics
  segmented: [
    COLORS.glass.segmented,
    LAYOUT.rounded.base,
    COLORS.shadow.liquidGlass,
    ANIMATIONS.transition.fast,
    "p-2 relative overflow-hidden",
  ].join(" "),

  segmentedActive: [
    COLORS.glass.segmentedActive,
    LAYOUT.rounded.base,
    COLORS.shadow.liquidHover,
    ANIMATIONS.transition.fast,
    ANIMATIONS.liquidGlass.elastic,
  ].join(" "),

  // Morphing card with dynamic liquid effects
  morphing: [
    COLORS.glass.enhanced,
    LAYOUT.rounded.base,
    COLORS.shadow.liquidGlass,
    ANIMATIONS.transition.elastic,
    ANIMATIONS.liquidGlass.morph,
    ANIMATIONS.liquidGlass.displacement,
    "relative overflow-hidden transform-gpu",
  ].join(" "),

  // Modal with advanced liquid glass
  modal: [
    COLORS.glass.modal,
    LAYOUT.rounded.lg,
    COLORS.shadow.liquidHover,
    "backdrop-blur-3xl backdrop-saturate-[2.5]",
    "border border-white/[0.25] dark:border-white/[0.15]",
    "relative overflow-hidden",
  ].join(" "),

  // Elastic card that responds to mouse interaction
  elastic: [
    COLORS.glass.enhanced,
    LAYOUT.rounded.base,
    COLORS.shadow.liquidGlass,
    ANIMATIONS.transition.elastic,
    ANIMATIONS.liquidGlass.elastic,
    "relative overflow-hidden transform-gpu cursor-pointer",
    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.1] before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
    "hover:before:opacity-100",
  ].join(" "),
} as const;

// Advanced Liquid Glass button variants inspired by Apple's design
export const BUTTON_STYLES = {
  primary: [
    "bg-blue-500/[0.8] backdrop-blur-xl backdrop-saturate-[1.8]",
    "border border-blue-400/[0.3] text-white font-medium",
    "hover:bg-blue-600/[0.95] hover:border-blue-400/[0.5] hover:backdrop-saturate-[2.2]",
    "hover:shadow-[0_4px_20px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]",
    "active:scale-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
    "dark:bg-blue-500/[0.7] dark:border-blue-400/[0.2]",
    "dark:hover:bg-blue-600/[0.85] dark:hover:border-blue-400/[0.4]",
    LAYOUT.rounded.base,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.liquid,
    ANIMATIONS.liquidGlass.interactive,
    COLORS.shadow.liquidGlass,
    "relative overflow-hidden transform-gpu",
    // Shimmer effect
    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
    "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
  ].join(" "),

  secondary: [
    COLORS.glass.enhanced,
    COLORS.text.onGlass,
    "font-medium",
    LAYOUT.rounded.base,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.liquid,
    ANIMATIONS.liquidGlass.interactive,
    "hover:bg-white/[0.15] hover:border-white/[0.3] hover:backdrop-saturate-[2.2]",
    "hover:shadow-[0_4px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.4)]",
    "active:scale-95",
    "dark:hover:bg-white/[0.12] dark:hover:border-white/[0.25]",
    COLORS.shadow.liquidGlass,
    "relative overflow-hidden transform-gpu",
  ].join(" "),

  // Ultimate liquid glass button with advanced effects
  liquidGlass: [
    COLORS.glass.chromatic,
    COLORS.text.onGlass,
    "font-medium",
    LAYOUT.rounded.base,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.elastic,
    ANIMATIONS.hover.liquidGlass,
    ANIMATIONS.liquidGlass.chromatic,
    "hover:bg-white/[0.12] hover:border-white/[0.4] hover:backdrop-saturate-[2.5]",
    "hover:shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_0_20px_rgba(255,255,255,0.1)]",
    "active:scale-95 active:backdrop-saturate-[3.0]",
    "dark:hover:bg-white/[0.10] dark:hover:border-white/[0.3]",
    COLORS.shadow.liquidGlass,
    "relative overflow-hidden transform-gpu cursor-pointer",
    // Advanced shimmer with chromatic hints
    "before:absolute before:inset-0 before:bg-gradient-to-r",
    "before:from-transparent before:via-white/15 before:to-transparent",
    "before:translate-x-[-100%] hover:before:translate-x-[100%]",
    "before:transition-transform before:duration-1000 before:ease-out",
    // Chromatic edge highlighting
    "after:absolute after:inset-0 after:rounded-[inherit] after:p-[1px]",
    "after:bg-gradient-to-r after:from-red-400/10 after:via-green-400/10 after:to-blue-400/10",
    "after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300",
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
    "hover:bg-white/15 hover:border-white/25 hover:backdrop-blur-xl hover:backdrop-saturate-[2.0]",
    "hover:shadow-[0_4px_20px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.05)]",
    "active:scale-95",
    "dark:hover:bg-white/10 dark:hover:border-white/15",
    "relative overflow-hidden transform-gpu",
  ].join(" "),

  // Segmented control buttons with liquid glass
  segmented: [
    "bg-transparent border-0",
    COLORS.text.onGlass,
    "font-medium px-5 py-2.5",
    LAYOUT.rounded.base,
    ANIMATIONS.transition.fast,
    "hover:bg-white/[0.06] dark:hover:bg-white/[0.03]",
    "relative overflow-hidden",
  ].join(" "),

  segmentedActive: [
    COLORS.glass.segmentedActive,
    COLORS.text.onGlass,
    "font-semibold px-5 py-2.5",
    LAYOUT.rounded.base,
    ANIMATIONS.transition.fast,
    COLORS.shadow.liquidGlass,
    ANIMATIONS.liquidGlass.elastic,
    "relative overflow-hidden",
  ].join(" "),

  // Enhanced icon button with liquid glass
  icon: [
    COLORS.glass.enhanced,
    COLORS.text.primary,
    "font-medium",
    LAYOUT.rounded.lg,
    "p-3",
    ANIMATIONS.transition.liquid,
    "hover:bg-white/15 hover:backdrop-saturate-[2.0] dark:hover:bg-gray-600/30",
    COLORS.shadow.liquidGlass,
    "hover:" + COLORS.shadow.liquidHover.replace("shadow-", ""),
    COLORS.border.liquidEdge,
    "hover:border-white/25 dark:hover:border-gray-500/30",
    "active:scale-95",
    "relative overflow-hidden transform-gpu",
  ].join(" "),

  // Elastic button with mouse-following deformation
  elastic: [
    COLORS.glass.enhanced,
    COLORS.text.onGlass,
    "font-medium",
    LAYOUT.rounded.base,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.elastic,
    ANIMATIONS.hover.elastic,
    ANIMATIONS.liquidGlass.elastic,
    "hover:bg-white/[0.12] hover:border-white/[0.3] hover:backdrop-saturate-[2.3]",
    "active:scale-95",
    COLORS.shadow.liquidGlass,
    "relative overflow-hidden transform-gpu cursor-pointer",
    // Dynamic gradient that follows mouse
    "before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300",
    "before:bg-gradient-radial before:from-white/20 before:to-transparent",
    "hover:before:opacity-100",
    // Mouse tracking (requires JS implementation)
    "[--mouse-x:50%] [--mouse-y:50%]",
    "before:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.2),transparent_70%)]",
  ].join(" "),

  // Glass button with displacement effect simulation
  displacement: [
    COLORS.glass.enhanced,
    COLORS.text.onGlass,
    "font-medium",
    LAYOUT.rounded.base,
    LAYOUT.padding.button.md,
    ANIMATIONS.transition.liquid,
    ANIMATIONS.liquidGlass.displacement,
    "hover:bg-white/[0.12] hover:border-white/[0.35] hover:backdrop-saturate-[2.4]",
    COLORS.shadow.displacement,
    "hover:" + COLORS.shadow.displacementHover.replace("shadow-", ""),
    "active:scale-95",
    "relative overflow-hidden transform-gpu",
    // Displacement effect simulation with CSS
    "before:absolute before:inset-0 before:opacity-0 before:transition-all before:duration-300",
    "before:bg-gradient-to-br before:from-transparent before:via-white/10 before:to-transparent",
    "hover:before:opacity-100 hover:before:scale-110 hover:before:rotate-1",
  ].join(" "),

  // Selected state with enhanced glass effect
  selectedGlass: [
    COLORS.glass.enhanced,
    "bg-white/20 dark:bg-slate-800/35 backdrop-blur-lg backdrop-saturate-[2.0]",
    COLORS.text.primary,
    LAYOUT.rounded.lg,
    LAYOUT.padding.button.sm,
    "ring-2 ring-white/40 dark:ring-slate-400/35",
    COLORS.shadow.liquidGlass,
    ANIMATIONS.transition.liquid,
    COLORS.border.liquidGlow,
    "relative overflow-hidden",
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

// Advanced Liquid Glass specific component styles inspired by Apple's implementation
export const LIQUID_GLASS_STYLES = {
  // Floating elements with maximum glassmorphism
  floating: [
    "bg-white/[0.06] backdrop-blur-3xl backdrop-saturate-[2.5]",
    "dark:bg-slate-900/[0.4] dark:backdrop-blur-3xl dark:backdrop-saturate-[2.2]",
    "shadow-[0_32px_64px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] border border-white/[0.4]",
    "dark:shadow-[0_32px_64px_rgba(0,0,0,0.4)] dark:border-white/[0.2]",
    LAYOUT.rounded.lg,
    "relative overflow-hidden",
  ].join(" "),

  // Panel elements with enhanced liquid glass
  panel: [
    "bg-white/[0.05] backdrop-blur-2xl backdrop-saturate-[2.0]",
    "dark:bg-slate-900/[0.3] dark:backdrop-blur-2xl dark:backdrop-saturate-[1.8]",
    "shadow-[0_20px_50px_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.08)]",
    "dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
    "border border-white/[0.25] dark:border-white/[0.12]",
    LAYOUT.rounded.lg,
    "relative overflow-hidden",
  ].join(" "),

  // Overlay backgrounds with maximum blur
  overlay: [
    "bg-white/[0.03] backdrop-blur-3xl backdrop-saturate-[2.8]",
    "dark:bg-slate-900/[0.2] dark:backdrop-blur-3xl dark:backdrop-saturate-[2.5]",
    "relative",
  ].join(" "),

  // Advanced slider components with liquid glass aesthetics
  slider: {
    track: [
      COLORS.glass.sliderTrack,
      "h-2 rounded-full relative overflow-hidden",
      COLORS.shadow.liquidGlass,
      "backdrop-blur-lg backdrop-saturate-[1.8]",
    ].join(" "),

    thumb: [
      COLORS.glass.sliderKnob,
      "w-6 h-6 rounded-full cursor-pointer",
      "transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
      "hover:scale-125 hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)]",
      "active:scale-110 active:shadow-[0_4px_15px_rgba(0,0,0,0.3)]",
      "backdrop-blur-sm backdrop-saturate-[1.5]",
      "relative overflow-hidden",
      // Shimmer effect on hover
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
      "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
    ].join(" "),

    range: [
      "bg-gradient-to-r from-blue-500/[0.9] to-purple-500/[0.9] h-full rounded-full",
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_0_10px_rgba(59,130,246,0.3)]",
      "backdrop-blur-sm backdrop-saturate-[1.6]",
    ].join(" "),
  },

  // Enhanced segmented control with liquid glass
  segmentedControl: [
    COLORS.glass.segmented,
    "flex p-1.5 rounded-xl",
    COLORS.shadow.liquidGlass,
    "gap-1 backdrop-blur-xl backdrop-saturate-[2.0]",
    "relative overflow-hidden",
    // Inner glow effect
    "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none",
  ].join(" "),

  // Mouse-responsive liquid glass container
  mouseResponsive: [
    COLORS.glass.enhanced,
    LAYOUT.rounded.base,
    COLORS.shadow.liquidGlass,
    ANIMATIONS.transition.elastic,
    "relative overflow-hidden transform-gpu cursor-pointer",
    // Mouse tracking variables (requires JS)
    "[--mouse-x:50%] [--mouse-y:50%] [--mouse-from-center:0]",
    // Dynamic background that follows mouse
    "before:absolute before:inset-0 before:opacity-0 before:transition-all before:duration-300",
    "before:bg-[radial-gradient(circle_300px_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.1),transparent)]",
    "hover:before:opacity-100",
    // Elastic scaling based on mouse distance
    "hover:scale-[calc(1_+_var(--mouse-from-center)_*_0.02)]",
  ].join(" "),

  // Chromatic aberration effect container
  chromaticGlass: [
    COLORS.glass.chromatic,
    LAYOUT.rounded.base,
    COLORS.shadow.liquidGlass,
    ANIMATIONS.transition.liquid,
    ANIMATIONS.liquidGlass.chromatic,
    "relative overflow-hidden transform-gpu",
    // Chromatic layers
    "before:absolute before:inset-0 before:rounded-[inherit] before:opacity-20",
    "before:bg-gradient-to-br before:from-red-500/10 before:via-transparent before:to-blue-500/10",
    "after:absolute after:inset-0 after:rounded-[inherit] after:opacity-10",
    "after:bg-gradient-to-tl after:from-green-500/10 after:via-transparent after:to-purple-500/10",
  ].join(" "),

  // Displacement wave effect (CSS simulation)
  displacementWave: [
    COLORS.glass.enhanced,
    LAYOUT.rounded.base,
    COLORS.shadow.displacement,
    ANIMATIONS.transition.liquid,
    ANIMATIONS.liquidGlass.displacement,
    "relative overflow-hidden transform-gpu",
    // Wave distortion simulation
    "before:absolute before:inset-0 before:rounded-[inherit]",
    "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
    "before:animate-[wave_3s_ease-in-out_infinite]",
    "after:absolute after:inset-0 after:rounded-[inherit]",
    "after:bg-gradient-to-b after:from-white/3 after:via-transparent after:to-white/3",
    "after:animate-[wave_3s_ease-in-out_infinite_reverse]",
  ].join(" "),

  // Elastic container that deforms with mouse interaction
  elasticContainer: [
    COLORS.glass.enhanced,
    LAYOUT.rounded.base,
    COLORS.shadow.liquidGlass,
    ANIMATIONS.transition.elastic,
    ANIMATIONS.liquidGlass.elastic,
    "relative overflow-hidden transform-gpu cursor-pointer",
    // Elastic deformation variables
    "[--elastic-x:0] [--elastic-y:0] [--elastic-intensity:0]",
    // Transform based on mouse position
    "hover:transform hover:scale-[calc(1_+_var(--elastic-intensity)_*_0.02)]",
    "hover:skew-x-[calc(var(--elastic-x)_*_0.5deg)]",
    "hover:skew-y-[calc(var(--elastic-y)_*_0.3deg)]",
  ].join(" "),

  // Frosted glass with maximum blur
  frostedGlass: [
    "bg-white/[0.02] backdrop-blur-3xl backdrop-saturate-[3.0]",
    "dark:bg-black/[0.1] dark:backdrop-blur-3xl dark:backdrop-saturate-[2.5]",
    "border border-white/[0.15] dark:border-white/[0.05]",
    LAYOUT.rounded.lg,
    COLORS.shadow.liquidGlass,
    "relative overflow-hidden",
    // Frost texture simulation
    "before:absolute before:inset-0 before:rounded-[inherit]",
    "before:bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]",
    "before:opacity-30",
  ].join(" "),

  // Interactive glass that responds to hover with liquid effects
  interactiveGlass: [
    COLORS.glass.enhanced,
    LAYOUT.rounded.base,
    COLORS.shadow.liquidGlass,
    ANIMATIONS.transition.liquid,
    "relative overflow-hidden transform-gpu cursor-pointer group",
    // Base interactive state
    "hover:bg-white/[0.08] hover:border-white/[0.25] hover:backdrop-saturate-[2.4]",
    "hover:shadow-[0_20px_60px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]",
    "active:scale-95 active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]",
    // Interactive highlight
    "before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0",
    "before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent",
    "before:transition-opacity before:duration-300",
    "group-hover:before:opacity-100",
    // Edge glow on interaction
    "after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0",
    "after:shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]",
    "after:transition-opacity after:duration-300",
    "group-hover:after:opacity-100",
  ].join(" "),
} as const;

// === ADVANCED LIQUID GLASS CSS KEYFRAMES ===
// Add these to your CSS file or use with Tailwind's addUtilities
export const LIQUID_GLASS_KEYFRAMES = `
  @keyframes liquid-morph {
    0%, 100% {
      transform: scale(1) rotate(0deg);
      border-radius: 1rem;
    }
    25% {
      transform: scale(1.02) rotate(0.5deg);
      border-radius: 1.2rem 0.8rem 1.1rem 0.9rem;
    }
    50% {
      transform: scale(1.01) rotate(-0.3deg);
      border-radius: 0.9rem 1.1rem 0.8rem 1.2rem;
    }
    75% {
      transform: scale(1.03) rotate(0.2deg);
      border-radius: 1.1rem 0.9rem 1.3rem 0.7rem;
    }
  }

  @keyframes liquid-breathe {
    0%, 100% {
      transform: scale(1);
      backdrop-filter: blur(12px) saturate(1.8);
    }
    50% {
      transform: scale(1.01);
      backdrop-filter: blur(16px) saturate(2.2);
    }
  }

  @keyframes liquid-shimmer {
    0% {
      background-position: -200% 0;
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      background-position: 200% 0;
      opacity: 0;
    }
  }

  @keyframes chromatic-shift {
    0%, 100% {
      filter: drop-shadow(0 0 0 rgba(255, 0, 0, 0))
              drop-shadow(0 0 0 rgba(0, 255, 0, 0))
              drop-shadow(0 0 0 rgba(0, 0, 255, 0));
    }
    33% {
      filter: drop-shadow(1px 0 0 rgba(255, 0, 0, 0.1))
              drop-shadow(-0.5px 0 0 rgba(0, 255, 0, 0.1))
              drop-shadow(0 0.5px 0 rgba(0, 0, 255, 0.1));
    }
    66% {
      filter: drop-shadow(-1px 0 0 rgba(255, 0, 0, 0.1))
              drop-shadow(0.5px 0 0 rgba(0, 255, 0, 0.1))
              drop-shadow(0 -0.5px 0 rgba(0, 0, 255, 0.1));
    }
  }

  @keyframes elastic-deform {
    0%, 100% {
      transform: scale(1) skew(0deg, 0deg);
    }
    25% {
      transform: scale(1.01) skew(0.5deg, 0.2deg);
    }
    50% {
      transform: scale(1.02) skew(-0.3deg, 0.4deg);
    }
    75% {
      transform: scale(1.01) skew(0.2deg, -0.1deg);
    }
  }

  @keyframes displacement-wave {
    0%, 100% {
      transform: translateX(0) scaleX(1);
      opacity: 0.3;
    }
    25% {
      transform: translateX(2px) scaleX(1.02);
      opacity: 0.6;
    }
    50% {
      transform: translateX(-1px) scaleX(0.98);
      opacity: 0.8;
    }
    75% {
      transform: translateX(1px) scaleX(1.01);
      opacity: 0.4;
    }
  }

  @keyframes wave {
    0%, 100% {
      transform: translateX(-100%) skewX(0deg);
    }
    50% {
      transform: translateX(100%) skewX(2deg);
    }
  }

  /* Utility classes for dynamic effects */
  .liquid-glass-hover {
    transition: all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .liquid-glass-hover:hover {
    transform: translateY(-2px) scale(1.02);
    backdrop-filter: blur(20px) saturate(2.4);
  }

  .liquid-glass-interactive {
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .liquid-glass-interactive::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), transparent 70%);
    opacity: 0;
    transition: opacity 300ms ease;
    pointer-events: none;
  }

  .liquid-glass-interactive:hover::before {
    opacity: 1;
  }

  /* Mouse tracking utilities (requires JS to set CSS variables) */
  .mouse-tracking {
    --mouse-x: 50%;
    --mouse-y: 50%;
    --mouse-from-center: 0;
  }

  .elastic-mouse-response {
    transition: transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: perspective(1000px)
               rotateX(calc(var(--mouse-y, 50%) * 0.1deg - 5deg))
               rotateY(calc(var(--mouse-x, 50%) * 0.1deg - 5deg))
               scale(calc(1 + var(--mouse-from-center, 0) * 0.02));
  }
`;

// === ADVANCED UTILITY FUNCTIONS ===

// Enhanced utility for combining styles with liquid glass effects
export const combineStyles = (
  ...styles: (string | undefined | null | false)[]
): string => {
  return styles.filter(Boolean).join(" ");
};

// Helper for conditional styles with liquid glass context
export const conditionalStyle = (
  condition: boolean,
  trueStyle: string,
  falseStyle = "",
): string => {
  return condition ? trueStyle : falseStyle;
};

// Advanced style builder for mouse-responsive liquid glass
export const createMouseResponsiveGlass = (
  baseStyles: string,
  intensity = 1,
) => {
  return combineStyles(
    baseStyles,
    LIQUID_GLASS_STYLES.mouseResponsive,
    `[--elastic-intensity:${intensity}]`,
    "mouse-tracking",
    "elastic-mouse-response",
  );
};

// Style builder for chromatic glass effect
export const createChromaticGlass = (baseStyles: string, intensity = 1) => {
  return combineStyles(
    baseStyles,
    LIQUID_GLASS_STYLES.chromaticGlass,
    `[--aberration-intensity:${intensity}]`,
  );
};

// Style builder for displacement wave effect
export const createDisplacementGlass = (baseStyles: string, scale = 70) => {
  return combineStyles(
    baseStyles,
    LIQUID_GLASS_STYLES.displacementWave,
    `[--displacement-scale:${scale}]`,
  );
};

// Style builder for elastic deformation
export const createElasticGlass = (baseStyles: string, elasticity = 0.15) => {
  return combineStyles(
    baseStyles,
    LIQUID_GLASS_STYLES.elasticContainer,
    `[--elasticity:${elasticity}]`,
  );
};

// Advanced liquid glass button builder
export const createLiquidGlassButton = (
  variant: keyof typeof BUTTON_STYLES = "liquidGlass",
  options: {
    mouseResponsive?: boolean;
    chromatic?: boolean;
    elastic?: boolean;
    displacement?: boolean;
  } = {},
) => {
  let styles = BUTTON_STYLES[variant];

  if (options.mouseResponsive) {
    styles = createMouseResponsiveGlass(styles);
  }

  if (options.chromatic) {
    styles = createChromaticGlass(styles);
  }

  if (options.elastic) {
    styles = createElasticGlass(styles);
  }

  if (options.displacement) {
    styles = createDisplacementGlass(styles);
  }

  return styles;
};

// Advanced liquid glass card builder
export const createLiquidGlassCard = (
  variant: keyof typeof CARD_STYLES = "enhanced",
  options: {
    mouseResponsive?: boolean;
    chromatic?: boolean;
    elastic?: boolean;
    floating?: boolean;
  } = {},
) => {
  let styles = CARD_STYLES[variant];

  if (options.floating) {
    styles = combineStyles(styles, LIQUID_GLASS_STYLES.floating);
  }

  if (options.mouseResponsive) {
    styles = createMouseResponsiveGlass(styles);
  }

  if (options.chromatic) {
    styles = createChromaticGlass(styles);
  }

  if (options.elastic) {
    styles = createElasticGlass(styles);
  }

  return styles;
};

// JavaScript utility functions for mouse tracking (to be used in React components)
export const MOUSE_TRACKING_UTILS = {
  // Calculate mouse position relative to element
  getMousePosition: (event: MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const centerX = 50;
    const centerY = 50;
    const fromCenter =
      Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) / 70.71; // Normalized to 0-1

    return { x, y, fromCenter };
  },

  // Apply mouse tracking to element
  applyMouseTracking: (element: HTMLElement, event: MouseEvent) => {
    const { x, y, fromCenter } = MOUSE_TRACKING_UTILS.getMousePosition(
      event,
      element,
    );

    element.style.setProperty("--mouse-x", `${x}%`);
    element.style.setProperty("--mouse-y", `${y}%`);
    element.style.setProperty("--mouse-from-center", fromCenter.toString());
  },

  // Reset mouse tracking
  resetMouseTracking: (element: HTMLElement) => {
    element.style.setProperty("--mouse-x", "50%");
    element.style.setProperty("--mouse-y", "50%");
    element.style.setProperty("--mouse-from-center", "0");
  },

  // Calculate elastic deformation
  calculateElasticDeformation: (
    mouseX: number,
    mouseY: number,
    intensity: number = 0.15,
  ) => {
    const elasticX = (mouseX - 50) * intensity * 0.1;
    const elasticY = (mouseY - 50) * intensity * 0.1;

    return { elasticX, elasticY };
  },

  // Apply elastic deformation
  applyElasticDeformation: (
    element: HTMLElement,
    event: MouseEvent,
    intensity: number = 0.15,
  ) => {
    const { x, y } = MOUSE_TRACKING_UTILS.getMousePosition(event, element);
    const { elasticX, elasticY } =
      MOUSE_TRACKING_UTILS.calculateElasticDeformation(x, y, intensity);

    element.style.setProperty("--elastic-x", elasticX.toString());
    element.style.setProperty("--elastic-y", elasticY.toString());
    element.style.setProperty("--elastic-intensity", intensity.toString());
  },
};

// React Hook for mouse tracking (to be used in React components)
export const useMouseTracking = () => {
  const handleMouseMove = (
    event: MouseEvent,
    element: HTMLElement,
    options?: {
      elastic?: boolean;
      intensity?: number;
    },
  ) => {
    MOUSE_TRACKING_UTILS.applyMouseTracking(element, event);

    if (options?.elastic) {
      MOUSE_TRACKING_UTILS.applyElasticDeformation(
        element,
        event,
        options.intensity,
      );
    }
  };

  const handleMouseLeave = (element: HTMLElement) => {
    MOUSE_TRACKING_UTILS.resetMouseTracking(element);
  };

  return { handleMouseMove, handleMouseLeave };
};
