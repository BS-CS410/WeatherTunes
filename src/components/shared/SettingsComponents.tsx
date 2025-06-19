import { Button } from "@/components/ui/button";
import { COLORS, TYPOGRAPHY, BUTTON_STYLES } from "@/lib/unifiedStyles";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  label: string;
  children: React.ReactNode;
}

export function SettingsSection({ label, children }: SettingsSectionProps) {
  return (
    <div>
      <label
        className={cn(
          "mb-2 block",
          TYPOGRAPHY.body.sm,
          "font-medium",
          COLORS.text.secondary,
        )}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

interface SettingsButtonGroupProps {
  options: Array<{
    value: string;
    label: string;
    isSelected: boolean;
    onClick: () => void;
  }>;
}

export function SettingsButtonGroup({ options }: SettingsButtonGroupProps) {
  return (
    <div className="flex gap-2 overflow-x-visible">
      {options.map(({ value, label, isSelected, onClick }) => (
        <Button
          key={value}
          variant={isSelected ? undefined : "outline"}
          size="sm"
          onClick={onClick}
          className={cn("flex-1", isSelected && BUTTON_STYLES.selectedGlass)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
