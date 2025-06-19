// Advanced Liquid Glass Components and Utilities
// Inspired by Apple's design and rdev/liquid-glass-react

export { LiquidGlassContainer } from "./LiquidGlassContainer";
export { LiquidGlassDemo } from "./LiquidGlassDemo";
export { default as useLiquidGlass } from "../../hooks/useLiquidGlass";

// Re-export utility functions for easy access
export {
  LIQUID_GLASS_STYLES,
  MOUSE_TRACKING_UTILS,
  createLiquidGlassButton,
  createLiquidGlassCard,
  createMouseResponsiveGlass,
  createChromaticGlass,
  createDisplacementGlass,
  createElasticGlass,
  combineStyles,
  conditionalStyle,
} from "../../lib/unifiedStyles";
