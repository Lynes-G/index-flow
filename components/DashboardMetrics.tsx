import type { AnalyticsData } from "@/lib/fetchAnalytics";
import {
  BarChart3,
  Calendar,
  Clock,
  ExternalLink,
  Globe,
  Link,
  Lock,
  MapPin,
  MousePointer,
  QrCode,
  TrendingUp,
  Users,
} from "lucide-react";

interface DashboardMetricsProps {
  analytics: AnalyticsData;
  canAccessAnalytics: boolean;
  canAccessUltraFeatures: boolean;
}

const DashboardMetrics = ({
  analytics,
  canAccessAnalytics,
  canAccessUltraFeatures,
}: DashboardMetricsProps) => {
  const metricCardClass =
    "rounded-[1.35rem] border border-slate-200/80 bg-white/92 p-4 shadow-sm shadow-slate-900/5 sm:p-5";
  const metricIconWrapClass =
    "rounded-[1rem] border border-white/80 p-3 shadow-sm shadow-slate-900/5";
  const summaryPanelClass =
    "rounded-[1.4rem] border border-slate-200/80 bg-white/72 p-4 sm:p-5";

  const formDate = ({ dateString }: { dateString: string | null }) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatReferrer = (referrer: string | null) => {
    if (!referrer || referrer === "direct") return "Direct";
    try {
      const url = new URL(referrer);
      return url.hostname.replace("www.", "");
    } catch {
      return referrer;
    }
  };

  const hasActivity =
    analytics.totalClicks > 0 ||
    analytics.uniqueVisitors > 0 ||
    analytics.totalLinksClicked > 0 ||
    analytics.qrScans > 0;

  if (!canAccessAnalytics) {
    return (
      <div className="space-y-6">
        <div className="rounded-[1.6rem] border border-slate-200/80 bg-white/92 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
              <BarChart3 className="size-6" />
            </div>
            <div className="space-y-2">
              <h2 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                Analytics unlock on Pro and above
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Detailed profile analytics are part of the paid analytics
                entitlement. While billing is paused, Pro and Ultra access come
                from admin-issued invites instead of direct checkout.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/85 p-4 shadow-sm shadow-slate-900/5 sm:p-5">
            <MousePointer className="size-5 text-slate-500" />
            <p className="mt-3 text-sm font-semibold text-slate-900">
              Track total clicks
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              See how often visitors interact with your public page and links.
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/85 p-4 shadow-sm shadow-slate-900/5 sm:p-5">
            <Users className="size-5 text-slate-500" />
            <p className="mt-3 text-sm font-semibold text-slate-900">
              Understand visitors
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Review unique visitor volume and the strongest activity windows.
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/85 p-4 shadow-sm shadow-slate-900/5 sm:p-5">
            <Globe className="size-5 text-slate-500" />
            <p className="mt-3 text-sm font-semibold text-slate-900">
              Unlock audience reach
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Pro opens analytics, and Ultra expands that view with richer
              geographic reach details.
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/82 p-4 text-sm leading-6 text-slate-600 shadow-sm shadow-slate-900/5 sm:p-5">
          New accounts stay on Free by default. Think of this page like a
          locked reporting room: the rail can explain what exists, but the full
          dashboard only opens once the analytics entitlement is active.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Last 30 days
          </p>
          <p className="text-sm leading-6 text-slate-600">
            Clicks, visitors, and profile activity in one workspace view.
          </p>
        </div>
        <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-slate-700 uppercase">
          {hasActivity ? "Activity tracked" : "Waiting for activity"}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <div className={metricCardClass}>
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <div
              className={`${metricIconWrapClass} bg-blue-50/95 text-blue-600`}
            >
              <MousePointer className="size-6" />
            </div>
            <div className="text-blue-200">
              <TrendingUp className="size-6" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-600">
              Total Clicks
            </p>
            <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {analytics.totalClicks.toLocaleString()}
            </p>
          </div>
        </div>

        <div className={metricCardClass}>
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <div
              className={`${metricIconWrapClass} bg-indigo-50/95 text-indigo-600`}
            >
              <Users className="size-6" />
            </div>
            <div className="text-indigo-200">
              <TrendingUp className="size-6" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-600">
              Unique Visitors
            </p>
            <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {analytics.uniqueVisitors.toLocaleString()}
            </p>
          </div>
        </div>

        {canAccessUltraFeatures ? (
          <div className={metricCardClass}>
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <div
                className={`${metricIconWrapClass} bg-emerald-50/95 text-emerald-600`}
              >
                <Globe className="size-6" />
              </div>
              <div className="text-emerald-200">
                <MapPin className="size-6" />
              </div>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-slate-600">
                Countries Reached
              </p>
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {analytics.countriesReached.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.35rem] border border-emerald-200/80 bg-white/85 p-4 shadow-sm shadow-slate-900/5 sm:p-5">
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <div
                className={`${metricIconWrapClass} bg-emerald-50/95 text-emerald-600`}
              >
                <Globe className="size-6" />
              </div>
              <div className="text-emerald-300">
                <Lock className="size-6" />
              </div>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-slate-600">
                Countries Reached
              </p>
              <div className="mt-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                Upgrade to Ultra
              </div>
              <p className="mt-3 text-sm text-slate-500">
                Unlock country-level reach insights.
              </p>
            </div>
          </div>
        )}

        <div className={metricCardClass}>
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <div
              className={`${metricIconWrapClass} bg-sky-50/95 text-sky-600`}
            >
              <Link className="size-6" />
            </div>
            <div className="text-sky-200">
              <ExternalLink className="size-6" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-600">
              Links Clicked
            </p>
            <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {analytics.totalLinksClicked.toLocaleString()}
            </p>
          </div>
        </div>

        <div className={metricCardClass}>
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <div
              className={`${metricIconWrapClass} bg-cyan-50/95 text-cyan-600`}
            >
              <QrCode className="size-6" />
            </div>
            <div className="text-cyan-200">
              <TrendingUp className="size-6" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-600">
              QR Scans
            </p>
            <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {analytics.qrScans.toLocaleString()}
            </p>
          </div>
        </div>

        <div className={metricCardClass}>
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <div
              className={`${metricIconWrapClass} bg-orange-50/95 text-orange-600`}
            >
              <Calendar className="size-6" />
            </div>
            <div className="text-orange-200">
              <Clock className="size-6" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-600">
              Last Activity
            </p>
            <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {formDate({ dateString: analytics.lastClick })}
            </p>
          </div>
        </div>
      </div>

      {!hasActivity && (
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-4 text-sm leading-6 text-slate-600 sm:p-5">
          <p className="font-semibold text-slate-900">No activity yet</p>
          <p className="mt-1">
            Share your link-in-bio to start tracking clicks and visitors.
          </p>
        </div>
      )}

      {(analytics.topLinkTitle || analytics.topReferrer) && (
        <div className="space-y-4 rounded-[1.6rem] border border-slate-200/80 bg-white/88 p-4 shadow-sm shadow-slate-900/5 sm:p-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Highlights
            </p>
            <p className="text-sm text-slate-600">
              A quick read on the strongest sources of recent activity.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
            {analytics.topLinkTitle && (
              <div className={summaryPanelClass}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-slate-900 p-2 text-white">
                    <ExternalLink className="size-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    Top Performing Link
                  </h3>
                </div>
                <p className="font-medium text-slate-700">
                  {analytics.topLinkTitle}
                </p>
              </div>
            )}

            {analytics.topReferrer && (
              <div className={summaryPanelClass}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-slate-900 p-2 text-white">
                    <Globe className="size-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Top Referrer</h3>
                </div>
                <p className="font-medium text-slate-700">
                  {formatReferrer(analytics.topReferrer)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMetrics;
