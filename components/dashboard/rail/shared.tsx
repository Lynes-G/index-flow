import * as React from "react";

import { cn } from "@/lib/frontend/shared/utils";

type DashboardRailCardProps = React.ComponentProps<"section">;

type DashboardRailHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

const railCardClassName = "dashboard-rail-card space-y-3.5 p-4 sm:space-y-4";

const railPanelClassName =
  "shadow-brand-purple-xs-soft border-2 border-brand-eggplant bg-white/90 p-3";

const DashboardRailCard = ({ className, ...props }: DashboardRailCardProps) => (
  <section className={cn(railCardClassName, className)} {...props} />
);

const DashboardRailHeader = ({
  eyebrow,
  title,
  description,
}: DashboardRailHeaderProps) => (
  <div className="space-y-1">
    <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
      {eyebrow}
    </p>
    <h2 className="font-['Sora',sans-serif] text-xl font-semibold tracking-[-0.04em] text-slate-900">
      {title}
    </h2>
    {description ? (
      <p className="hidden text-sm leading-6 text-slate-600 sm:block">
        {description}
      </p>
    ) : null}
  </div>
);

const DashboardRailPanel = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div className={cn(railPanelClassName, className)} {...props} />
);

export { DashboardRailCard, DashboardRailHeader, DashboardRailPanel };
