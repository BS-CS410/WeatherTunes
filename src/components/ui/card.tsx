import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Glassmorphism: increased blur, reduced opacity, subtle border
        "relative flex flex-col gap-4 overflow-hidden rounded-xl py-6 shadow-lg backdrop-blur-lg transition-transform duration-200 dark:shadow-2xl dark:shadow-black/40",
        "border border-white/20 dark:border-white/10", // Subtle border
        "bg-white/60 dark:bg-slate-900/60", // Adjusted light and dark backgrounds opacity
        "hover:scale-[1.015] hover:shadow-xl dark:hover:scale-[1.015] dark:hover:bg-slate-800/70 dark:hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]", // Adjusted hover effects
        className,
      )}
      {...props}
    >
      {/* Soft inner shadow for extra depth */}
      <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_1px_8px_0_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_8px_0_rgba(0,0,0,0.08)]" />
      <div className="transition-transform duration-200 group-hover:scale-[1.015]">
        {props.children}
      </div>
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
