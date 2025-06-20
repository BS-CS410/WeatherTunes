import React from "react";
import { CARD_STYLES, LAYOUT } from "@/lib/design-system";
import { cn } from "@/lib/dom-helpers";
import { LiquidGlassContainer } from "@/components/liquid-glass";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: keyof typeof CARD_STYLES;
  className?: string;
  enableLiquidGlass?: boolean;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  withPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "base",
      className = "",
      enableLiquidGlass = false,
      ...props
    },
    ref,
  ) => {
    // Use overflow-visible for interactive and base variants to prevent clipping
    const overflowClass =
      variant === "interactive" || variant === "base"
        ? "overflow-visible"
        : "overflow-hidden";

    const cardContent = (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col",
          overflowClass,
          CARD_STYLES[variant],
          className,
        )}
        {...props}
      >
        {/* Gentle Apple-style depth with very subtle white outline */}
        <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.15)] dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.05)]" />
        <div className="relative z-10 flex-1">{children}</div>
      </div>
    );

    if (enableLiquidGlass) {
      return (
        <LiquidGlassContainer variant="enhanced" className="w-full">
          {cardContent}
        </LiquidGlassContainer>
      );
    }

    return cardContent;
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
