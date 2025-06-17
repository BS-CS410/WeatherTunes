/**
 * Shared style constants to eliminate duplication across components
 * Centralized styling system for consistent design and easy maintenance
 */

// Glass morphism card styles - used throughout the app
export const GLASS_CARD_STYLES = {
  base: "bg-white/40 backdrop-blur-md dark:bg-slate-900/75",
  interactive:
    "hover:bg-white/50 hover:shadow-lg dark:hover:bg-slate-900/60 dark:hover:shadow-lg",
  modal:
    "bg-white/40 backdrop-blur-md dark:bg-slate-900/75 hover:scale-100 hover:shadow-lg dark:hover:scale-100",
} as const;

// Text color schemes - consistent across components
export const TEXT_COLORS = {
  primary: "text-gray-900 dark:text-slate-100",
  secondary: "text-gray-700 dark:text-slate-300",
  muted: "text-gray-600 dark:text-slate-400",
  interactive: "hover:text-gray-900 dark:hover:text-slate-100",
} as const;

// Button styles - consolidated from scattered implementations
export const BUTTON_STYLES = {
  primary:
    "bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70",
  outline:
    "border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80",
} as const;

// Common spacing and layout patterns
export const LAYOUT = {
  container: "flex w-full max-w-2xl flex-col items-stretch gap-4 px-4",
  section: "space-y-6",
  cardPadding: "p-6",
  cardContentPadding: "px-6",
} as const;

// Loading and error states
export const STATE_STYLES = {
  loading: "flex min-h-dvh flex-col items-center justify-center overflow-auto",
  error: "flex min-h-dvh flex-col items-center justify-center overflow-auto",
  loadingText: "text-2xl text-gray-700 dark:text-slate-300",
  errorText: "text-2xl text-red-500",
  errorSubtext: "text-sm text-red-400",
} as const;
