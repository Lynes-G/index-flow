import * as React from "react";

import { cn } from "@/lib/frontend/shared/utils";

const inputBaseClassName =
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-11 w-full min-w-0 rounded-lg border bg-white/92 px-3.5 py-2 text-base shadow-xs transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

const inputFocusClassName =
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

const inputInvalidClassName =
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        inputBaseClassName,
        inputFocusClassName,
        inputInvalidClassName,
        className,
      )}
      {...props}
    />
  );
}

export { Input };
