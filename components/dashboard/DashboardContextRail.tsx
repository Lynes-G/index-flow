import * as React from "react";

import { cn } from "@/lib/utils";

function DashboardContextRail({
  className,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="dashboard-context-rail"
      className={cn(
        "sticky top-28 rounded-[1.9rem] border border-[color:color-mix(in_srgb,var(--brand-eggplant)_10%,white)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] p-5 shadow-[0_22px_60px_rgba(59,21,42,0.08)] backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

export { DashboardContextRail };
