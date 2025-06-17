import { forwardRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GLASS_CARD_STYLES } from "@/lib/sharedStyles";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  variant?: keyof typeof GLASS_CARD_STYLES;
  className?: string;
  contentClassName?: string;
  withPadding?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      variant = "base",
      className = "",
      contentClassName = "",
      withPadding = true,
    },
    ref,
  ) => {
    return (
      <Card ref={ref} className={cn(GLASS_CARD_STYLES[variant], className)}>
        <CardContent
          className={cn(withPadding ? "p-6" : "p-0", contentClassName)}
        >
          {children}
        </CardContent>
      </Card>
    );
  },
);

GlassCard.displayName = "GlassCard";
