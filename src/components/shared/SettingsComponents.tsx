import { Button } from "@/components/ui/button";
import { COLORS, TYPOGRAPHY } from "@/lib/unifiedStyles";
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
    <div className="flex gap-2">
      {options.map(({ value, label, isSelected, onClick }) => (
        <Button
          key={value}
          variant={isSelected ? "default" : "outline"}
          size="sm"
          onClick={onClick}
          className="flex-1"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
