import React from "react";
import { CARD_STYLES, LAYOUT } from "@/lib";
import { cn } from "@/lib";
import { LiquidGlassContainer } from "@/components/liquid-glass";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: keyof typeof CARD_STYLES | "modal";
  className?: string;
  contentClassName?: string;
  withPadding?: boolean;
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
      contentClassName = "",
      withPadding = true,
      enableLiquidGlass = false,
      ...props
    },
    ref,
  ) => {
    // Use overflow-visible for interactive and base variants to prevent clipping
    const overflowClass =
      variant === "interactive" || variant === "base" || variant === "modal"
        ? "overflow-visible"
        : "overflow-hidden";

    // Handle modal variant
    const cardStyles =
      variant === "modal"
        ? "backdrop-blur-xl backdrop-saturate-[2.2] bg-white/[0.06] border border-white/[0.15] dark:bg-black/[0.18] dark:border-white/[0.06] rounded-lg"
        : CARD_STYLES[variant as keyof typeof CARD_STYLES];

    const cardContent = (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col",
          overflowClass,
          cardStyles,
          className,
        )}
        {...props}
      >
        {/* Gentle Apple-style depth with very subtle white outline */}
        <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.15)] dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.05)]" />
        <div className="relative z-10 flex-1">
          {contentClassName || !withPadding ? (
            <CardContent className={contentClassName} withPadding={withPadding}>
              {children}
            </CardContent>
          ) : (
            children
          )}
        </div>
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
