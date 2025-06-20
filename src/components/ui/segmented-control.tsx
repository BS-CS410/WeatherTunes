import { cn } from "@/lib/dom-helpers";
import { LIQUID_GLASS_STYLES, BUTTON_STYLES } from "@/lib/design-system";

interface SegmentedControlProps {
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

/**
 * Apple-style segmented control with liquid glass design
 * Matches the "For You / Library" style from Apple's design
 */
export function SegmentedControl({
  options,
  value,
  onValueChange,
  className = "",
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        LIQUID_GLASS_STYLES.segmentedControl,
        "segmented-control-container",
        className,
      )}
      role="radiogroup"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onValueChange(option.value)}
          className={cn(
            "segmented-control-item",
            value === option.value
              ? [BUTTON_STYLES.segmentedActive, "active"]
              : [
                  BUTTON_STYLES.segmented,
                  "hover:bg-white/[0.08] dark:hover:bg-black/[0.08]",
                ],
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
