import { BarChart3, Globe, Lock, MousePointer, Users } from "lucide-react";

import {
  DashboardRailCard,
  DashboardRailHeader,
  DashboardRailPanel,
} from "@/components/dashboard/rail/shared";
import { normalizeAnalyticsText } from "@/lib/frontend/analytics/analyticsFormatting";
import type { AnalyticsData } from "@/lib/frontend/analytics/fetchAnalytics";

type DashboardRailAnalyticsSummaryProps = {
  analytics: AnalyticsData;
  canAccessAnalytics: boolean;
  canAccessUltraFeatures: boolean;
  isSampleMode?: boolean;
};

const createAnalyticsStats = ({
  analytics,
  canAccessUltraFeatures,
  isSampleMode,
}: Pick<
  DashboardRailAnalyticsSummaryProps,
  "analytics" | "canAccessUltraFeatures" | "isSampleMode"
>) => [
  {
    label: "Clicks",
    value: analytics.totalClicks.toLocaleString(),
    icon: MousePointer,
  },
  {
    label: "Visitors",
    value: analytics.uniqueVisitors.toLocaleString(),
    icon: Users,
  },
  {
    label: "Countries",
    value:
      canAccessUltraFeatures || isSampleMode
        ? analytics.countriesReached.toLocaleString()
        : "Ultra",
    icon: canAccessUltraFeatures || isSampleMode ? Globe : Lock,
  },
];

const getAnalyticsHighlight = (analytics: AnalyticsData) =>
  normalizeAnalyticsText(analytics.topLinkTitle) ||
  (normalizeAnalyticsText(analytics.topReferrer)
    ? `Top referrer: ${normalizeAnalyticsText(analytics.topReferrer)}`
    : "Share your public page in one real place to start collecting useful traffic patterns.");

const DashboardRailAnalyticsSummary = ({
  analytics,
  canAccessAnalytics,
  canAccessUltraFeatures,
  isSampleMode = false,
}: DashboardRailAnalyticsSummaryProps) => {
  const stats = createAnalyticsStats({
    analytics,
    canAccessUltraFeatures,
    isSampleMode,
  });
  const highlight = getAnalyticsHighlight(analytics);

  return (
    <DashboardRailCard>
      <DashboardRailHeader
        eyebrow="Analytics summary"
        title={isSampleMode ? "Sample 30-day read" : "Quick 30-day read"}
        description={
          isSampleMode
            ? "Example numbers that show how this area reads once traffic arrives."
            : "Fast snapshot of recent activity."
        }
      />

      {isSampleMode ? (
        <div className="bg-brand-accent-soft text-brand-accent-ink rounded-lg border border-[color:color-mix(in_srgb,var(--brand-accent)_34%,white)] p-3 text-sm leading-6">
          Sample mode is on. These numbers are illustrative, not real traffic.
        </div>
      ) : null}

      {!canAccessAnalytics && !isSampleMode ? (
        <div className="rounded-lg border border-amber-200/80 bg-amber-50/90 p-3 text-sm leading-6 text-amber-950">
          Analytics unlock on Pro.
        </div>
      ) : null}

      <div className="grid gap-2.5 min-[420px]:grid-cols-3 xl:grid-cols-1 xl:gap-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <DashboardRailPanel
            key={label}
            className="flex items-center justify-between border-slate-200/75 bg-white/85 px-3 py-2.5 xl:py-3"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                {label}
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900 xl:text-lg">
                {value}
              </p>
            </div>
            <div className="bg-brand-eggplant rounded-lg p-2 text-white xl:rounded-lg">
              <Icon className="size-4" />
            </div>
          </DashboardRailPanel>
        ))}
      </div>

      <DashboardRailPanel>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white p-2 text-slate-900 shadow-sm">
            <BarChart3 className="size-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">Highlight</p>
            <p className="text-sm leading-6 break-words text-slate-600">
              {highlight}
            </p>
          </div>
        </div>
      </DashboardRailPanel>
    </DashboardRailCard>
  );
};

export default DashboardRailAnalyticsSummary;
