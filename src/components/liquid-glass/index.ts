// Advanced Liquid Glass Components and Utilities
// Inspired by Apple's design and rdev/liquid-glass-react

export { LiquidGlassContainer } from "./LiquidGlassContainer";
export { default as useLiquidGlass } from "../../hooks/useLiquidGlass";

// Re-export essential utility functions
export {
  LIQUID_GLASS_STYLES,
  createLiquidGlassButton,
  createLiquidGlassCard,
  combineStyles,
  conditionalStyle,
} from "@/lib/design-system";
