import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SettingsSection,
  SettingsButtonGroup,
} from "@/components/shared/SettingsComponents";
import { COLORS, TYPOGRAPHY, LAYOUT } from "@/lib/unifiedStyles";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SettingsCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsCard({ isOpen, onClose }: SettingsCardProps) {
  const {
    settings,
    setTemperatureUnit,
    setTimeFormat,
    setSpeedUnit,
    setThemeMode,
    resetToDefaults,
  } = useSettings();

  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      onClose(); // Close settings menu after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card variant="modal" className="mx-4 w-full max-w-md">
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <h2 className={cn(TYPOGRAPHY.display.md, COLORS.text.primary)}>
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

          <div className={LAYOUT.spacing.lg.replace("gap-", "space-y-")}>
            {/* Temperature Unit */}
            <SettingsSection label="Temperature Unit">
              <SettingsButtonGroup
                options={[
                  {
                    value: "F",
                    label: "Fahrenheit (°F)",
                    isSelected: settings.temperatureUnit === "F",
                    onClick: () => setTemperatureUnit("F"),
                  },
                  {
                    value: "C",
                    label: "Celsius (°C)",
                    isSelected: settings.temperatureUnit === "C",
                    onClick: () => setTemperatureUnit("C"),
                  },
                ]}
              />
            </SettingsSection>

            {/* Time Format */}
            <SettingsSection label="Time Format">
              <SettingsButtonGroup
                options={[
                  {
                    value: "12h",
                    label: "12 Hour (6:30 pm)",
                    isSelected: settings.timeFormat === "12h",
                    onClick: () => setTimeFormat("12h"),
                  },
                  {
                    value: "24h",
                    label: "24 Hour (18:30)",
                    isSelected: settings.timeFormat === "24h",
                    onClick: () => setTimeFormat("24h"),
                  },
                ]}
              />
            </SettingsSection>

            {/* Theme Mode */}
            <SettingsSection label="Theme Mode">
              <SettingsButtonGroup
                options={[
                  {
                    value: "auto",
                    label: "Auto",
                    isSelected: settings.themeMode === "auto",
                    onClick: () => setThemeMode("auto"),
                  },
                  {
                    value: "light",
                    label: "Light",
                    isSelected: settings.themeMode === "light",
                    onClick: () => setThemeMode("light"),
                  },
                  {
                    value: "dark",
                    label: "Dark",
                    isSelected: settings.themeMode === "dark",
                    onClick: () => setThemeMode("dark"),
                  },
                ]}
              />
            </SettingsSection>

            {/* Wind Speed Unit */}
            <SettingsSection label="Wind Speed Unit">
              <SettingsButtonGroup
                options={[
                  {
                    value: "mph",
                    label: "mph",
                    isSelected: settings.speedUnit === "mph",
                    onClick: () => setSpeedUnit("mph"),
                  },
                  {
                    value: "kmh",
                    label: "km/h",
                    isSelected: settings.speedUnit === "kmh",
                    onClick: () => setSpeedUnit("kmh"),
                  },
                  {
                    value: "ms",
                    label: "m/s",
                    isSelected: settings.speedUnit === "ms",
                    onClick: () => setSpeedUnit("ms"),
                  },
                ]}
              />
            </SettingsSection>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-gray-200 pt-4 dark:border-slate-700">
              <Button
                variant="outline"
                onClick={resetToDefaults}
                className="flex-1"
              >
                Reset to Defaults
              </Button>
              <Button onClick={onClose} className="flex-1">
                Done
              </Button>
            </div>

            {/* Authentication Section */}
            {user && (
              <div className="border-t border-gray-200 pt-4 dark:border-slate-700">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 disabled:opacity-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                >
                  {isLoggingOut ? "Signing Out..." : "Sign Out of Spotify"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
