import { createContext } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
  const [temperatureUnit, setTemperatureUnit] =
    useLocalStorage<TemperatureUnit>(
      "temperatureUnit",
      defaultSettings.temperatureUnit,
    );
  const [timeFormat, setTimeFormat] = useLocalStorage<TimeFormat>(
    "timeFormat",
    defaultSettings.timeFormat,
  );
  const [speedUnit, setSpeedUnit] = useLocalStorage<SpeedUnit>(
    "speedUnit",
    defaultSettings.speedUnit,
  );
  const [themeMode, setThemeMode] = useLocalStorage<ThemeMode>(
    "themeMode",
    defaultSettings.themeMode,
  );

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
    setTemperatureUnit(defaultSettings.temperatureUnit);
    setTimeFormat(defaultSettings.timeFormat);
    setSpeedUnit(defaultSettings.speedUnit);
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
