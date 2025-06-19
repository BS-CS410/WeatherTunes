import { Button } from "@/components/ui/button";
import { COLORS, TYPOGRAPHY, BUTTON_STYLES } from "@/lib/unifiedStyles";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  label: string;
  children: React.ReactNode;
}

export function SettingsSection({ label, children }: SettingsSectionProps) {
  return (
    <div className="space-y-3">
      <label
        className={cn(
          "block",
          TYPOGRAPHY.body.sm,
          "font-semibold tracking-wide",
          COLORS.text.secondary,
          "text-xs uppercase",
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
        <div
          key={value}
          className="flex-1 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02]"
        >
          <Button
            variant={isSelected ? undefined : "outline"}
            size="sm"
            onClick={onClick}
            className={cn(
              "w-full font-medium",
              isSelected &&
                cn(
                  BUTTON_STYLES.liquidGlass,
                  "border-white/[0.4] bg-white/[0.2] backdrop-blur-xl backdrop-saturate-[1.8] hover:bg-white/[0.25] dark:border-white/[0.25] dark:bg-white/[0.15] dark:hover:bg-white/[0.2]",
                  "font-semibold text-gray-900 shadow-sm dark:text-white",
                ),
            )}
          >
            {label}
          </Button>
        </div>
      ))}
    </div>
  );
}
