import { cn } from "@/lib";

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
        {/* Track - inlined slider.track styles */}
        <div
          className={cn(
            "border border-white/[0.1] bg-black/[0.06] dark:border-white/[0.08] dark:bg-white/[0.04]",
            "relative h-2 overflow-hidden rounded-full",
            "shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)]",
            "backdrop-blur-lg backdrop-saturate-[1.8]",
          )}
        >
          {/* Progress - inlined slider.range styles */}
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-blue-500/[0.9] to-purple-500/[0.9]",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_0_10px_rgba(59,130,246,0.3)]",
              "backdrop-blur-sm backdrop-saturate-[1.6]",
            )}
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

        {/* Custom thumb - inlined slider.thumb styles */}
        <div
          className={cn(
            "border border-white/[0.15] bg-white/[0.95] shadow-[0_2px_8px_rgba(0,0,0,0.2)]",
            "dark:border-white/[0.20] dark:bg-white/[0.90] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
            "h-6 w-6 cursor-pointer rounded-full",
            "transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
            "hover:scale-125 hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)]",
            "active:scale-110 active:shadow-[0_4px_15px_rgba(0,0,0,0.3)]",
            "relative overflow-hidden backdrop-blur-sm backdrop-saturate-[1.5]",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
            "before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]",
            "pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
          )}
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
