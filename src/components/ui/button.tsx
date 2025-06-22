import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/30 aria-invalid:border-destructive liquid-glass-interactive",
  {
    variants: {
      variant: {
        // Inlined primary button styles
        default: [
          "bg-blue-500/[0.8] backdrop-blur-xl backdrop-saturate-[1.8]",
          "border border-blue-400/[0.3] text-white font-medium",
          "hover:bg-blue-600/[0.95] hover:border-blue-400/[0.5] hover:backdrop-saturate-[2.2]",
          "hover:shadow-[0_4px_20px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]",
          "active:scale-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
          "dark:bg-blue-500/[0.7] dark:border-blue-400/[0.2]",
          "dark:hover:bg-blue-600/[0.85] dark:hover:border-blue-400/[0.4]",
          "rounded-xl px-4 py-2 transition-all duration-200 ease-out transform-gpu",
          "shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)]",
          "relative overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
          "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        ].join(" "),
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/30 dark:bg-destructive/70",
        // Inlined secondary button styles
        outline: [
          "bg-black/[0.03] border border-white/[0.08] text-gray-900",
          "dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-gray-100",
          "font-medium rounded-xl px-4 py-2 transition-all duration-200 ease-out transform-gpu",
          "hover:bg-white/[0.15] hover:border-white/[0.3] hover:backdrop-saturate-[2.2]",
          "hover:shadow-[0_4px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.4)]",
          "active:scale-95 dark:hover:bg-white/[0.12] dark:hover:border-white/[0.25]",
          "shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)]",
          "relative overflow-hidden",
        ].join(" "),
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        // Inlined ghost button styles
        ghost: [
          "bg-transparent border border-transparent text-gray-600 dark:text-gray-400",
          "hover:text-gray-900 dark:hover:text-gray-100 font-medium rounded-xl px-4 py-2",
          "transition-all duration-200 ease-out transform-gpu",
          "hover:bg-white/15 hover:border-white/25 hover:backdrop-blur-xl hover:backdrop-saturate-[2.0]",
          "hover:shadow-[0_4px_20px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.05)]",
          "active:scale-95 dark:hover:bg-white/10 dark:hover:border-white/15",
          "relative overflow-hidden",
        ].join(" "),
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3 rounded-xl",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-2xl px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
