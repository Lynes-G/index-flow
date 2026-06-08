import * as React from "react";

import { dashboardSurfaceClasses } from "@/components/dashboard/styles";
import { cn } from "@/lib/frontend/shared/utils";

function AdminPageShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="admin-page-shell"
      // The admin shell controls page width only.
      // Use it when the page needs consistent breathing room, not extra visuals.
      className={cn(dashboardSurfaceClasses.pageShell, className)}
      {...props}
    />
  );
}

function AdminSurface({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="admin-surface"
      // AdminSurface is the matching content card for admin pages.
      // Splitting width and surface concerns keeps page files easier to reason about.
      className={cn(
        dashboardSurfaceClasses.card,
        dashboardSurfaceClasses.cardPaddingRelaxed,
        "backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

export { AdminPageShell, AdminSurface };
