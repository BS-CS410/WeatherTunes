import { COLORS, TYPOGRAPHY, LAYOUT } from "@/lib/unifiedStyles";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        LAYOUT.container.center,
        "min-h-dvh overflow-auto",
        className,
      )}
    >
      <p className={cn("text-2xl", COLORS.text.secondary)}>{message}</p>
    </div>
  );
}

interface ErrorDisplayProps {
  title: string;
  message?: string;
  className?: string;
}

export function ErrorDisplay({
  title,
  message,
  className = "",
}: ErrorDisplayProps) {
  return (
    <div
      className={cn(
        LAYOUT.container.center,
        LAYOUT.container.column,
        "min-h-dvh overflow-auto",
        className,
      )}
    >
      <p className="text-2xl text-red-500">{title}</p>
      {message && (
        <p className={cn(TYPOGRAPHY.body.sm, "text-red-400")}>{message}</p>
      )}
    </div>
  );
}
