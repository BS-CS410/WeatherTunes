import { cn } from "@/lib/lib-utils";
import { LIQUID_GLASS_STYLES } from "@/lib/unifiedStyles";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
  className?: string;
  label?: string;
}

/**
 * Apple-style liquid glass slider with blue progress and white knob
 * Matches the slider design from Apple's liquid glass examples
 */
export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className = "",
  label,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(Number(event.target.value));
  };

  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Track */}
        <div className={cn(LIQUID_GLASS_STYLES.slider.track)}>
          {/* Progress */}
          <div
            className={cn(LIQUID_GLASS_STYLES.slider.range)}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Hidden input for accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
          aria-label={label || "Slider"}
        />

        {/* Custom thumb */}
        <div
          className={cn(
            LIQUID_GLASS_STYLES.slider.thumb,
            "pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
          )}
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
