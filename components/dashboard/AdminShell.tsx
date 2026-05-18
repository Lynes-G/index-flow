import * as React from "react"

import { cn } from "@/lib/utils"

function AdminPageShell({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="admin-page-shell"
      className={cn("mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-8", className)}
      {...props}
    />
  )
}

function AdminSurface({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="admin-surface"
      className={cn(
        "rounded-3xl border border-slate-200/70 bg-white/95 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6 lg:p-8",
        className
      )}
      {...props}
    />
  )
}

export { AdminPageShell, AdminSurface }
