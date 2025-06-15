import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const {
    settings,
    setTemperatureUnit,
    setTimeFormat,
    setSpeedUnit,
    setThemeMode,
    resetToDefaults,
  } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="mx-4 w-full max-w-md bg-white/40 backdrop-blur-md hover:scale-100 hover:shadow-lg dark:bg-slate-900/75 dark:hover:scale-100 dark:hover:bg-slate-900/75 dark:hover:shadow-lg">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              Settings
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700/80 dark:hover:text-slate-200"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Temperature Unit */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                Temperature Unit
              </label>
              <div className="flex gap-2">
                <Button
                  variant={
                    settings.temperatureUnit === "F" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setTemperatureUnit("F")}
                  className={`flex-1 ${
                    settings.temperatureUnit === "F"
                      ? "bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70"
                      : "border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  Fahrenheit (°F)
                </Button>
                <Button
                  variant={
                    settings.temperatureUnit === "C" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setTemperatureUnit("C")}
                  className={`flex-1 ${
                    settings.temperatureUnit === "C"
                      ? "bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70"
                      : "border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  Celsius (°C)
                </Button>
              </div>
            </div>

            {/* Time Format */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                Time Format
              </label>
              <div className="flex gap-2">
                <Button
                  variant={
                    settings.timeFormat === "12h" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setTimeFormat("12h")}
                  className={`flex-1 ${
                    settings.timeFormat === "12h"
                      ? "bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70"
                      : "border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  12 Hour (6:30 pm)
                </Button>
                <Button
                  variant={
                    settings.timeFormat === "24h" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setTimeFormat("24h")}
                  className={`flex-1 ${
                    settings.timeFormat === "24h"
                      ? "bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70"
                      : "border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  24 Hour (18:30)
                </Button>
              </div>
            </div>

            {/* Theme Mode */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                Theme Mode
              </label>
              <div className="flex gap-2">
                <Button
                  variant={
                    settings.themeMode === "auto" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setThemeMode("auto")}
                  className={`flex-1 ${
                    settings.themeMode === "auto"
                      ? "bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70"
                      : "border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  Auto
                </Button>
                <Button
                  variant={
                    settings.themeMode === "light" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setThemeMode("light")}
                  className={`flex-1 ${
                    settings.themeMode === "light"
                      ? "bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70"
                      : "border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  Light
                </Button>
                <Button
                  variant={
                    settings.themeMode === "dark" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setThemeMode("dark")}
                  className={`flex-1 ${
                    settings.themeMode === "dark"
                      ? "bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70"
                      : "border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  Dark
                </Button>
              </div>
            </div>

            {/* Wind Speed Unit */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                Wind Speed Unit
              </label>
              <div className="flex gap-2">
                <Button
                  variant={settings.speedUnit === "mph" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSpeedUnit("mph")}
                  className={`flex-1 ${
                    settings.speedUnit === "mph"
                      ? "bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70"
                      : "border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  mph
                </Button>
                <Button
                  variant={settings.speedUnit === "kmh" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSpeedUnit("kmh")}
                  className={`flex-1 ${
                    settings.speedUnit === "kmh"
                      ? "bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70"
                      : "border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  km/h
                </Button>
                <Button
                  variant={settings.speedUnit === "ms" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSpeedUnit("ms")}
                  className={`flex-1 ${
                    settings.speedUnit === "ms"
                      ? "bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70"
                      : "border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80"
                  }`}
                >
                  m/s
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-gray-200 pt-4 dark:border-slate-700">
              <Button
                variant="outline"
                onClick={resetToDefaults}
                className="flex-1 border-gray-300/40 bg-white/30 text-gray-700 backdrop-blur-sm hover:bg-white/50 hover:text-gray-900 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80"
              >
                Reset to Defaults
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-slate-600/70 text-white hover:bg-slate-700/80 dark:bg-slate-500/60 dark:hover:bg-slate-600/70"
              >
                Done
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
