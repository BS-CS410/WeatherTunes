import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useLocationBasedDefaults } from "@/hooks/useLocationBasedDefaults";

type TemperatureUnit = "F" | "C";
type TimeFormat = "12h" | "24h";
type SpeedUnit = "mph" | "kmh" | "ms";
type ThemeMode = "auto" | "light" | "dark";

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
      console.log("Checking if we should apply location-based defaults...");

      // Only update if the user hasn't explicitly set their preferences
      const hasExistingPrefs =
        localStorage.getItem("temperatureUnit") ||
        localStorage.getItem("speedUnit");

      console.log(`Has existing preferences: ${!!hasExistingPrefs}`);
      console.log(`Location defaults:`, locationDefaults);

      if (!hasExistingPrefs) {
        console.log("Applying location-based defaults");
        setTemperatureUnit(locationDefaults.temperatureUnit);
        setSpeedUnit(locationDefaults.speedUnit);
      } else {
        console.log("User has existing preferences, keeping them");
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
    setTemperatureUnit(temperatureUnit === "F" ? "C" : "F");
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
