import React from "react";
import { CARD_STYLES, LAYOUT } from "@/lib/unifiedStyles";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: keyof typeof CARD_STYLES;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  withPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "base", className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col overflow-hidden",
          CARD_STYLES[variant],
          className,
        )}
        {...props}
      >
        {/* Soft inner shadow for depth */}
        <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_1px_8px_0_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_8px_0_rgba(0,0,0,0.08)]" />
        <div className="relative z-10 flex-1">{children}</div>
      </div>
    );
  },
);

Card.displayName = "Card";

export function CardContent({
  children,
  className = "",
  withPadding = true,
}: CardContentProps) {
  return (
    <div
      className={cn(
        withPadding ? LAYOUT.padding.lg : LAYOUT.padding.none,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardContentProps) {
  return (
    <div className={cn(LAYOUT.padding.lg, "pb-0", className)}>{children}</div>
  );
}

export function CardTitle({ children, className = "" }: CardContentProps) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}
