import { BarChart3, Globe, Lock, MousePointer, Users } from "lucide-react";

import type { AnalyticsData } from "@/lib/fetchAnalytics";

type DashboardRailAnalyticsSummaryProps = {
  analytics: AnalyticsData;
  canAccessAnalytics: boolean;
  canAccessUltraFeatures: boolean;
};

const DashboardRailAnalyticsSummary = ({
  analytics,
  canAccessAnalytics,
  canAccessUltraFeatures,
}: DashboardRailAnalyticsSummaryProps) => {
  const stats = [
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
      value: canAccessUltraFeatures
        ? analytics.countriesReached.toLocaleString()
        : "Ultra",
      icon: canAccessUltraFeatures ? Globe : Lock,
    },
  ];

  const highlight =
    analytics.topLinkTitle ||
    (analytics.topReferrer
      ? `Top referrer: ${analytics.topReferrer}`
      : "Share your page to start collecting traffic patterns.");

  return (
    <section className="space-y-4 rounded-[1.55rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.94))] p-4">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
          Analytics summary
        </p>
        <h2 className="font-['Sora',sans-serif] text-xl font-semibold tracking-[-0.04em] text-slate-900">
          Quick 30-day read
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          A compact snapshot of the profile activity that matters most while
          you review the full metrics workspace.
        </p>
      </div>

      {!canAccessAnalytics ? (
        <div className="rounded-[1.25rem] border border-amber-200/80 bg-amber-50/90 p-3 text-sm leading-6 text-amber-950">
          Analytics access starts on Pro. This rail still shows the current
          profile snapshot so you can understand what will unlock next.
        </div>
      ) : null}

      <div className="grid gap-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-[1.2rem] border border-slate-200/80 bg-white/90 px-3 py-3"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                {label}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {value}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-2 text-white">
              <Icon className="size-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-slate-200/80 bg-slate-50/90 p-3">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2 text-slate-900 shadow-sm">
            <BarChart3 className="size-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">Highlight</p>
            <p className="text-sm leading-6 text-slate-600">{highlight}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardRailAnalyticsSummary;
