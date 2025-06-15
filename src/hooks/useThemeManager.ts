import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import type { TimePeriod } from "@/lib/utils";

/**
 * Hook that manages theme application based on settings and time period
 */
export function useThemeManager(timePeriod: TimePeriod | null) {
  const { settings } = useSettings();

  useEffect(() => {
    const root = window.document.documentElement;

    if (settings.themeMode === "light") {
      root.classList.remove("dark");
    } else if (settings.themeMode === "dark") {
      root.classList.add("dark");
    } else {
      // Auto mode - use time period
      if (!timePeriod) {
        // Fallback to system preference if no time period
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (systemDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      } else {
        // Use time period for auto mode
        if (timePeriod === "evening" || timePeriod === "night") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    }
  }, [settings.themeMode, timePeriod]);
}
