// Common transition styles used throughout the app
export const TRANSITIONS = {
  hover:
    "transition-transform duration-200 ease-in-out hover:-translate-y-2 hover:scale-105 hover:drop-shadow-md",
  hoverSmall:
    "transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:drop-shadow-sm",
  default: "transition-all duration-200 ease-out",
} as const;

// Common text styles
export const TEXT_STYLES = {
  heading:
    "font-inter-tight font-semibold tracking-wider text-gray-900 uppercase dark:text-slate-200",
  temperature:
    "font-inter-tight leading-none font-bold text-gray-900 drop-shadow-lg dark:text-cyan-50",
  condition:
    "font-inter-tight leading-none font-extralight tracking-tighter text-gray-800 lowercase dark:text-cyan-100",
  timeLabel:
    "font-inter-tight leading-none font-light tracking-wider whitespace-nowrap",
} as const;

// Common glass morphism styles
export const GLASS_STYLES = {
  card: "bg-white/40 backdrop-blur-md dark:bg-slate-900/75",
} as const;
