import {
  SettingsSection,
  SettingsButtonGroup,
} from "../shared/SettingsComponents";

interface ThemeSwitcherProps {
  themeMode: "light" | "dark" | "auto";
  onThemeChange: (mode: "light" | "dark" | "auto") => void;
}

export function ThemeSwitcher({
  themeMode,
  onThemeChange,
}: ThemeSwitcherProps) {
  return (
    <SettingsSection label="Theme">
      <SettingsButtonGroup
        options={[
          {
            value: "light",
            label: "Light",
            isSelected: themeMode === "light",
            onClick: () => onThemeChange("light"),
          },
          {
            value: "dark",
            label: "Dark",
            isSelected: themeMode === "dark",
            onClick: () => onThemeChange("dark"),
          },
          {
            value: "auto",
            label: "Auto",
            isSelected: themeMode === "auto",
            onClick: () => onThemeChange("auto"),
          },
        ]}
      />
    </SettingsSection>
  );
}
