import { createContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { useLocationBasedDefaults } from "@/hooks/useLocationBasedDefaults";
import { SettingsService } from "@/services/SettingsService";
import type {
  TemperatureUnit,
  TimeFormat,
  ThemeMode,
} from "@/types/units-types";
import type { Settings, LocationDefaults } from "@/services/SettingsService";

interface SettingsContextType {
  settings: Settings;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTemperatureUnit: () => void;
  toggleTimeFormat: () => void;
  resetToDefaults: () => void;
  // Location-based defaults info for debugging
  locationDefaults: LocationDefaults | null;
  isLocationLoading: boolean;
}

export type { SettingsContextType };

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export { SettingsContext };

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { locationDefaults, isLoading: locationLoading } =
    useLocationBasedDefaults();
  const [settings, setSettings] = useState<Settings>(() =>
    SettingsService.getInstance().getSettings(),
  );
  const [defaultsInitialized, setDefaultsInitialized] = useState(false);
  const settingsService = SettingsService.getInstance();

  // Update settings state when they change in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setSettings(settingsService.getSettings());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [settingsService]);

  // Update defaults when location is determined (only if not already set)
  useEffect(() => {
    if (!locationLoading && locationDefaults && !defaultsInitialized) {
      // Only update if the user hasn't explicitly set their preferences
      const hasExistingPrefs = localStorage.getItem("temperatureUnit");

      if (!hasExistingPrefs) {
        settingsService.setTemperatureUnit(locationDefaults.temperatureUnit);
        setSettings(settingsService.getSettings());
      }

      setDefaultsInitialized(true);
    }
  }, [locationLoading, locationDefaults, defaultsInitialized, settingsService]);

  const setTemperatureUnit = useCallback(
    (unit: TemperatureUnit) => {
      settingsService.setTemperatureUnit(unit);
      setSettings((prev) => ({ ...prev, temperatureUnit: unit }));
    },
    [settingsService],
  );

  const setTimeFormat = useCallback(
    (format: TimeFormat) => {
      settingsService.setTimeFormat(format);
      setSettings((prev) => ({ ...prev, timeFormat: format }));
    },
    [settingsService],
  );

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      settingsService.setThemeMode(mode);
      setSettings((prev) => ({ ...prev, themeMode: mode }));
    },
    [settingsService],
  );

  const toggleTemperatureUnit = useCallback(() => {
    const newUnit = settingsService.toggleTemperatureUnit();
    setSettings((prev) => ({ ...prev, temperatureUnit: newUnit }));
  }, [settingsService]);

  const toggleTimeFormat = useCallback(() => {
    const newFormat = settingsService.toggleTimeFormat();
    setSettings((prev) => ({ ...prev, timeFormat: newFormat }));
  }, [settingsService]);

  const resetToDefaults = useCallback(() => {
    const defaults = locationDefaults || {
      temperatureUnit: "metric",
    };

    settingsService.resetToDefaults({
      temperatureUnit: defaults.temperatureUnit,
      timeFormat: "12h",
      themeMode: "auto",
    });

    setSettings(settingsService.getSettings());
  }, [locationDefaults, settingsService]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setTemperatureUnit,
        setTimeFormat,
        setThemeMode,
        toggleTemperatureUnit,
        toggleTimeFormat,
        resetToDefaults,
        locationDefaults,
        isLocationLoading: locationLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
