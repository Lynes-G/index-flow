import { AnalyticsData } from "@/lib/fetchAnalytics";
import {
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
  // Define props here as needed, e.g. analytics data
  analytics: AnalyticsData;
  canAccessUltraFeatures: boolean;
}

const DashboardMetrics = ({
  analytics,
  canAccessUltraFeatures,
}: DashboardMetricsProps) => {
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

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-semibold text-slate-900">
              Analytics Overview
            </h2>
            <p className="text-sm text-slate-600 sm:text-base">
              Last 30 days performance metrics
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Total clicks */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
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

            {/* Unique visitors */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
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
            {/* Countries reached */}
            {canAccessUltraFeatures ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
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
                <div className="rounded-2xl border border-slate-200 bg-white p-5 opacity-80 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
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

            {/* Total links clicked */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
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

            {/* QR scans */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
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

            {/* Activity period */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
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
            <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
              <p className="text-sm font-semibold text-slate-900">
                No activity yet
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Share your link-in-bio to start tracking clicks and visitors.
              </p>
            </div>
          )}

          {/* Additional metrics */}
          {(analytics.topLinkTitle || analytics.topReferrer) && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Top performing link */}
              {analytics.topLinkTitle && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-slate-500 p-2">
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

              {/* Top Referrer */}
              {analytics.topReferrer && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-slate-500 p-2">
                      <Globe className="size-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Top Referrer
                    </h3>
                  </div>
                  <p className="font-medium text-slate-700">
                    {formatReferrer(analytics.topReferrer)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
};

export default DashboardMetrics;
