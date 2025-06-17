import React from "react";

// Card wrapper that matches our glassomorphic design

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/20 bg-white/40 py-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.015] hover:border-white/30 hover:bg-white/50 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/75 dark:shadow-2xl dark:shadow-black/40 dark:hover:border-white/20 dark:hover:bg-slate-900/60 ${className}`}
        {...props}
      >
        {/* Soft inner shadow for extra depth */}
        <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_1px_8px_0_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_8px_0_rgba(0,0,0,0.08)]" />
        <div className="transition-transform duration-200">{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";

export function CardContent({
  children,
  className = "",
}: CardContentProps) {
  return <div className={`px-6 ${className}`}>{children}</div>;
}

export function CardHeader({
  children,
  className = "",
}: CardContentProps) {
  return <div className={`px-6 pb-0 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = "",
}: CardContentProps) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}
