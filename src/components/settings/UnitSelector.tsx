import {
  SettingsSection,
  SettingsButtonGroup,
} from "../settings/SettingsComponents";
import type { TemperatureUnit } from "@/types/units-types";

interface UnitSelectorProps {
  temperatureUnit: TemperatureUnit;
  onTemperatureChange: (unit: TemperatureUnit) => void;
}

export function UnitSelector({
  temperatureUnit,
  onTemperatureChange,
}: UnitSelectorProps) {
  return (
    <>
      <SettingsSection label="Temperature">
        <SettingsButtonGroup
          options={[
            {
              value: "F",
              label: "°F",
              isSelected: temperatureUnit === "imperial",
              onClick: () => onTemperatureChange("imperial"),
            },
            {
              value: "C",
              label: "°C",
              isSelected: temperatureUnit === "metric",
              onClick: () => onTemperatureChange("metric"),
            },
          ]}
        />
      </SettingsSection>
    </>
  );
}
