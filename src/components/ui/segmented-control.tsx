import { cn } from "@/lib/dom-helpers";

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
        // Inlined segmentedControl styles - preserving exact visual appearance
        "border border-white/[0.08] bg-black/[0.03] dark:border-white/[0.06] dark:bg-white/[0.03]",
        "flex rounded-xl p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)]",
        "relative gap-1 overflow-hidden backdrop-blur-xl backdrop-saturate-[2.0]",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/5 before:to-transparent",
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
              ? // Active state - inlined segmentedActive styles
                [
                  "border border-white/[0.2] bg-white/[0.85] backdrop-blur-xl backdrop-saturate-[2.0]",
                  "dark:border-white/[0.12] dark:bg-white/[0.08]",
                  "rounded-lg px-5 py-2.5 font-semibold text-gray-900 dark:text-gray-100",
                  "transition-all duration-200 ease-out",
                  "shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)]",
                  "relative transform-gpu overflow-hidden",
                  "active",
                ]
              : // Inactive state - inlined segmented styles
                [
                  "border-0 bg-transparent text-gray-700 dark:text-gray-300",
                  "rounded-lg px-5 py-2.5 font-medium transition-all duration-150",
                  "hover:bg-white/[0.08] dark:hover:bg-black/[0.08]",
                  "relative overflow-hidden",
                ],
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
