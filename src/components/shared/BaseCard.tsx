import { forwardRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface BaseCardProps {
  children: React.ReactNode;
  variant?: "base" | "interactive" | "modal";
  className?: string;
  contentClassName?: string;
  withPadding?: boolean;
  enableLiquidGlass?: boolean;
}

export const BaseCard = forwardRef<HTMLDivElement, BaseCardProps>(
  (
    {
      children,
      variant = "interactive",
      className = "",
      contentClassName = "",
      withPadding = true,
      enableLiquidGlass = false,
    },
    ref,
  ) => {
    return (
      <Card
        ref={ref}
        variant={variant}
        className={className}
        enableLiquidGlass={enableLiquidGlass}
      >
        <CardContent className={contentClassName} withPadding={withPadding}>
          {children}
        </CardContent>
      </Card>
    );
  },
);

BaseCard.displayName = "BaseCard";
