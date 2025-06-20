import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "@/hooks/hooks-utility";
import { useLocationBasedDefaults } from "@/hooks/useLocationBasedDefaults";
import type {
  TemperatureUnit,
  TimeFormat,
  SpeedUnit,
  ThemeMode,
} from "@/types/units-types";

interface Settings {
  temperatureUnit: TemperatureUnit;
  timeFormat: TimeFormat;
  speedUnit: SpeedUnit;
  themeMode: ThemeMode;
}

interface SettingsContextType {
  settings: Settings;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setSpeedUnit: (unit: SpeedUnit) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTemperatureUnit: () => void;
  toggleTimeFormat: () => void;
  resetToDefaults: () => void;
  // Location-based defaults info for debugging
  locationDefaults: {
    temperatureUnit: TemperatureUnit;
    speedUnit: SpeedUnit;
  } | null;
  isLocationLoading: boolean;
}

export type { SettingsContextType };

const defaultSettings: Settings = {
  temperatureUnit: "F",
  timeFormat: "12h",
  speedUnit: "mph",
  themeMode: "auto",
};

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
  const [defaultsInitialized, setDefaultsInitialized] = useState(false);

  // Determine the actual defaults to use
  const actualDefaults = locationDefaults || defaultSettings;

  const [temperatureUnit, setTemperatureUnit] =
    useLocalStorage<TemperatureUnit>(
      "temperatureUnit",
      actualDefaults.temperatureUnit,
    );
  const [timeFormat, setTimeFormat] = useLocalStorage<TimeFormat>(
    "timeFormat",
    defaultSettings.timeFormat,
  );
  const [speedUnit, setSpeedUnit] = useLocalStorage<SpeedUnit>(
    "speedUnit",
    actualDefaults.speedUnit,
  );
  const [themeMode, setThemeMode] = useLocalStorage<ThemeMode>(
    "themeMode",
    defaultSettings.themeMode,
  );

  // Update defaults when location is determined (only if not already set)
  useEffect(() => {
    if (!locationLoading && locationDefaults && !defaultsInitialized) {
      // Only update if the user hasn't explicitly set their preferences
      const hasExistingPrefs =
        localStorage.getItem("temperatureUnit") ||
        localStorage.getItem("speedUnit");

      if (!hasExistingPrefs) {
        setTemperatureUnit(locationDefaults.temperatureUnit);
        setSpeedUnit(locationDefaults.speedUnit);
      }

      setDefaultsInitialized(true);
    }
  }, [
    locationLoading,
    locationDefaults,
    defaultsInitialized,
    setTemperatureUnit,
    setSpeedUnit,
  ]);

  const settings: Settings = {
    temperatureUnit,
    timeFormat,
    speedUnit,
    themeMode,
  };

  const toggleTemperatureUnit = () => {
    // Cycle through F -> C -> K -> F
    setTemperatureUnit(
      temperatureUnit === "F" ? "C" : temperatureUnit === "C" ? "K" : "F",
    );
  };

  const toggleTimeFormat = () => {
    setTimeFormat(timeFormat === "12h" ? "24h" : "12h");
  };

  const resetToDefaults = () => {
    const defaultsToUse = locationDefaults || defaultSettings;
    setTemperatureUnit(defaultsToUse.temperatureUnit);
    setTimeFormat(defaultSettings.timeFormat);
    setSpeedUnit(defaultsToUse.speedUnit);
    setThemeMode(defaultSettings.themeMode);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setTemperatureUnit,
        setTimeFormat,
        setSpeedUnit,
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
