import { UnitSelector } from "./UnitSelector.tsx";
import { ThemeSwitcher } from "./ThemeSwitcher.tsx";
import { useSettings } from "@/hooks/common";

export function SettingsPanel() {
  const { settings, setTemperatureUnit, setSpeedUnit, setThemeMode } =
    useSettings();

  return (
    <div className="space-y-6">
      <UnitSelector
        temperatureUnit={settings.temperatureUnit}
        speedUnit={settings.speedUnit}
        onTemperatureChange={setTemperatureUnit}
        onSpeedChange={setSpeedUnit}
      />
      <ThemeSwitcher
        themeMode={settings.themeMode}
        onThemeChange={setThemeMode}
      />
    </div>
  );
}
