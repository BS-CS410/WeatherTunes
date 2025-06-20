import {
  SettingsSection,
  SettingsButtonGroup,
} from "../shared/SettingsComponents";
import type { TemperatureUnit, SpeedUnit } from "@/types/units-types";

interface UnitSelectorProps {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  onTemperatureChange: (unit: TemperatureUnit) => void;
  onSpeedChange: (unit: SpeedUnit) => void;
}

export function UnitSelector({
  temperatureUnit,
  speedUnit,
  onTemperatureChange,
  onSpeedChange,
}: UnitSelectorProps) {
  return (
    <>
      <SettingsSection label="Temperature">
        <SettingsButtonGroup
          options={[
            {
              value: "F",
              label: "°F",
              isSelected: temperatureUnit === "F",
              onClick: () => onTemperatureChange("F"),
            },
            {
              value: "C",
              label: "°C",
              isSelected: temperatureUnit === "C",
              onClick: () => onTemperatureChange("C"),
            },
          ]}
        />
      </SettingsSection>
      <SettingsSection label="Speed">
        <SettingsButtonGroup
          options={[
            {
              value: "mph",
              label: "mph",
              isSelected: speedUnit === "mph",
              onClick: () => onSpeedChange("mph"),
            },
            {
              value: "kmh",
              label: "km/h",
              isSelected: speedUnit === "kmh",
              onClick: () => onSpeedChange("kmh"),
            },
          ]}
        />
      </SettingsSection>
    </>
  );
}
