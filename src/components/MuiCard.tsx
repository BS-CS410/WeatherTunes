import React from "react";

// MUI Card wrapper that matches our glassomorphic design
// This preserves the exact same styling as our shadcn/ui Card but uses MUI as the foundation

interface MuiCardProps {
  children: React.ReactNode;
  className?: string;
}

interface MuiCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: MuiCardProps) {
  return (
    <div
      className={`relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/20 bg-white/40 py-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.015] hover:border-white/30 hover:bg-white/50 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/75 dark:shadow-2xl dark:shadow-black/40 dark:hover:border-white/20 dark:hover:bg-slate-900/60 ${className}`}
      {...props}
    >
      {/* Soft inner shadow for extra depth */}
      <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_1px_8px_0_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_8px_0_rgba(0,0,0,0.08)]" />
      <div className="transition-transform duration-200">{children}</div>
    </div>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: MuiCardContentProps) {
  return (
    <div className={`px-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
