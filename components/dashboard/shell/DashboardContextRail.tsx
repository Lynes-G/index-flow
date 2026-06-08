import * as React from "react";

import { dashboardSurfaceClasses } from "@/components/dashboard/styles";
import { cn } from "@/lib/frontend/shared/utils";

function DashboardContextRail({
  className,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="dashboard-context-rail"
      // This wrapper gives every page a consistent "supporting context" surface
      // so page-level rails can focus on content instead of repeating container styles.
      className={cn(dashboardSurfaceClasses.contextRail, className)}
      {...props}
    />
  );
}

export { DashboardContextRail };
