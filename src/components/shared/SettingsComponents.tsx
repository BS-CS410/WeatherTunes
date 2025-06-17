import { Button } from "@/components/ui/button";
import { BUTTON_STYLES, TEXT_COLORS } from "@/lib/sharedStyles";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  label: string;
  children: React.ReactNode;
}

export function SettingsSection({ label, children }: SettingsSectionProps) {
  return (
    <div>
      <label
        className={cn("mb-2 block text-sm font-medium", TEXT_COLORS.secondary)}
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
    <div className="flex gap-2">
      {options.map(({ value, label, isSelected, onClick }) => (
        <Button
          key={value}
          variant={isSelected ? "default" : "outline"}
          size="sm"
          onClick={onClick}
          className={cn(
            "flex-1",
            isSelected ? BUTTON_STYLES.primary : BUTTON_STYLES.outline,
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
