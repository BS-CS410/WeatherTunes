import { cn } from "@/lib/dom-helpers";
import { useSettings } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import {
  SettingsSection,
  SettingsButtonGroup,
} from "@/components/shared/SettingsComponents";
import { COLORS, TYPOGRAPHY, BUTTON_STYLES } from "@/lib/design-system";
import { useState } from "react";
import { BaseCard } from "@/components/shared/BaseCard";

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
    <>
      {/* Backdrop with subtle blur */}
      <div
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px] transition-all duration-500 ease-out dark:bg-black/20"
        onClick={onClose}
      />

      {/* Left Sidebar Panel */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-96 transform transition-all duration-500 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Main Settings Panel */}
        <div className="flex h-full flex-col p-6">
          <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
            <BaseCard
              enableLiquidGlass
              className="flex h-full min-h-0 flex-col shadow-2xl"
              contentClassName="flex flex-col h-full min-h-0 p-0"
              withPadding={false}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] p-6 dark:border-white/[0.04]">
                <h2
                  className={cn(
                    TYPOGRAPHY.display.lg,
                    COLORS.text.primary,
                    "font-semibold",
                  )}
                >
                  Settings
                </h2>
                <button
                  onClick={onClose}
                  className={cn(
                    BUTTON_STYLES.icon,
                    // Center the X perfectly in the circle
                    "flex h-9 min-h-0 w-9 min-w-0 items-center justify-center rounded-full p-0 text-lg leading-none transition-all duration-200 hover:scale-110 hover:bg-white/[0.1] dark:hover:bg-white/[0.05]",
                  )}
                  aria-label="Close settings"
                  style={{
                    lineHeight: 1,
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="flex h-full w-full items-center justify-center">
                    ✕
                  </span>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  {/* Temperature Unit */}
                  <div className="transition-all duration-300 hover:-translate-y-0.5">
                    <SettingsSection label="Temperature Unit">
                      <SettingsButtonGroup
                        options={[
                          {
                            value: "F",
                            label: "°F",
                            isSelected: settings.temperatureUnit === "F",
                            onClick: () => setTemperatureUnit("F"),
                          },
                          {
                            value: "C",
                            label: "°C",
                            isSelected: settings.temperatureUnit === "C",
                            onClick: () => setTemperatureUnit("C"),
                          },
                          {
                            value: "K",
                            label: "K",
                            isSelected: settings.temperatureUnit === "K",
                            onClick: () => setTemperatureUnit("K"),
                          },
                        ]}
                      />
                    </SettingsSection>
                  </div>

                  {/* Time Format */}
                  <div className="transition-all duration-300 hover:-translate-y-0.5">
                    <SettingsSection label="Time Format">
                      <SettingsButtonGroup
                        options={[
                          {
                            value: "12h",
                            label: "12 Hour",
                            isSelected: settings.timeFormat === "12h",
                            onClick: () => setTimeFormat("12h"),
                          },
                          {
                            value: "24h",
                            label: "24 Hour",
                            isSelected: settings.timeFormat === "24h",
                            onClick: () => setTimeFormat("24h"),
                          },
                        ]}
                      />
                    </SettingsSection>
                  </div>

                  {/* Theme Mode */}
                  <div className="transition-all duration-300 hover:-translate-y-0.5">
                    <SettingsSection label="Appearance">
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
                  </div>

                  {/* Wind Speed Unit */}
                  <div className="transition-all duration-300 hover:-translate-y-0.5">
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
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-white/[0.08] p-6 dark:border-white/[0.04]">
                <div className="space-y-4">
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <div className="flex-1 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]">
                      <button
                        onClick={resetToDefaults}
                        className={cn(
                          BUTTON_STYLES.secondary,
                          "w-full font-medium",
                        )}
                      >
                        Reset Defaults
                      </button>
                    </div>
                    <div className="flex-1 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]">
                      <button
                        onClick={onClose}
                        className={cn(
                          BUTTON_STYLES.liquidGlass,
                          "w-full font-semibold",
                        )}
                      >
                        Done
                      </button>
                    </div>
                  </div>

                  {/* Authentication Section */}
                  {user && (
                    <div className="transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={cn(
                          BUTTON_STYLES.secondary,
                          "w-full border-red-300/50 font-medium text-red-700 hover:bg-red-50/50 hover:text-red-800 disabled:opacity-50",
                          "dark:border-red-800/40 dark:text-red-300 dark:hover:border-red-700/60 dark:hover:bg-red-900/25 dark:hover:text-red-200",
                        )}
                      >
                        {isLoggingOut
                          ? "Signing Out..."
                          : "Sign Out of Spotify"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </>
  );
}
