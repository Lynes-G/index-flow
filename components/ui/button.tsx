import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/frontend/shared/utils";

const buttonBaseClassName =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-[background-color,border-color,box-shadow,color,opacity,transform] duration-200 ease-out outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[loading=true]:pointer-events-none data-[loading=true]:opacity-70 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/55 focus-visible:ring-[3px] focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40";

const buttonVariantClassNames = {
  default:
    "border-2 border-brand-eggplant bg-primary text-primary-foreground shadow-brand-neon-sm hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--brand-eggplant)_88%,black)]",
  destructive:
    "border-2 border-destructive bg-destructive text-white shadow-[4px_4px_0_color-mix(in_srgb,var(--destructive)_28%,transparent)] hover:-translate-y-0.5 hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
  outline:
    "border border-[color:color-mix(in_srgb,var(--brand-eggplant)_22%,transparent)] bg-white/90 text-slate-700 shadow-xs hover:border-brand-eggplant hover:bg-brand-sand hover:text-brand-eggplant dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
  secondary:
    "border-2 border-brand-eggplant bg-button-secondary text-button-secondary-foreground shadow-brand-purple-sm hover:-translate-y-0.5 hover:bg-button-secondary-hover",
  accent:
    "border-2 border-[var(--accent-color,var(--brand-eggplant))] bg-[var(--accent-color,var(--brand-eggplant))] text-[var(--accent-foreground,var(--primary-foreground))] shadow-[4px_4px_0_var(--accent-shadow,var(--brand-neon))] hover:-translate-y-0.5 hover:opacity-90 focus-visible:ring-[var(--accent-ring,var(--ring))]",
  soft: "border border-[color:color-mix(in_srgb,var(--brand-eggplant)_16%,transparent)] bg-white/84 text-slate-700 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.45)] hover:border-slate-300 hover:bg-white hover:text-slate-900",
  quiet:
    "border border-transparent bg-transparent text-slate-600 hover:bg-white/70 hover:text-slate-900",
  ghost:
    "border border-transparent bg-transparent text-slate-700 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
  link: "text-primary underline-offset-4 hover:underline",
} as const;

const buttonSizeClassNames = {
  default: "h-10 px-4 py-2 has-[>svg]:px-3",
  sm: "h-9 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
  lg: "h-12 rounded-lg px-6 has-[>svg]:px-4",
  hero: "h-auto min-h-13 rounded-lg px-6 py-4 text-base",
  action: "h-auto min-h-11 rounded-lg px-4 py-3",
  icon: "size-10",
  "icon-sm": "size-9",
  "icon-lg": "size-11",
} as const;

const buttonVariants = cva(buttonBaseClassName, {
  variants: {
    variant: buttonVariantClassNames,
    size: buttonSizeClassNames,
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

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
