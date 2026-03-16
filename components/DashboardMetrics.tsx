import { AnalyticsData } from "@/lib/fetchAnalytics";
import { Protect } from "@clerk/nextjs";
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
}

const DashboardMetrics = ({ analytics }: DashboardMetricsProps) => {
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

  return (
    <div className="mb-8 bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Analytics Overview
            </h2>
            <p className="text-gray-600"> Last 30 days performance metrics</p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
            {/* Total clicks */}
            <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-blue-500 p-3">
                  <MousePointer className="size-6 text-white" />
                </div>
                <div className="text-blue-600">
                  <TrendingUp className="size-6" />
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-blue-700">
                  Total Clicks
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {analytics.totalClicks.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Unique visitors */}
            <div className="rounded-2xl border border-purple-200 bg-linear-to-br from-purple-50 to-purple-100 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-purple-500 p-3">
                  <Users className="size-6 text-white" />
                </div>
                <div className="text-purple-600">
                  <TrendingUp className="size-6" />
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-purple-700">
                  Unique Visitors
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {analytics.uniqueVisitors.toLocaleString()}
                </p>
              </div>
            </div>
            {/* Countries reached */}
            <Protect
              plan="ultra"
              fallback={
                <div className="rounded-2xl border border-green-200 bg-linear-to-br from-green-50 to-green-100 p-6 opacity-75">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-green-500 p-3">
                      <Globe className="size-6 text-white" />
                    </div>
                    <div className="text-green-600">
                      <Lock className="size-6" />
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-green-700">
                      Countries Reached
                    </p>
                    <p className="text-3xl font-bold text-green-900">
                      "Upgrade to Ultra"
                    </p>
                  </div>
                </div>
              }
            >
              <div className="rounded-2xl border border-green-200 bg-linear-to-br from-green-50 to-green-100 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-green-500 p-3">
                    <Globe className="size-6 text-white" />
                  </div>
                  <div className="text-green-600">
                    <MapPin className="size-6" />
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-green-700">
                    Countries Reached
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {analytics.countriesReached.toLocaleString()}
                  </p>
                </div>
              </div>
            </Protect>

            {/* Total links clicked */}
            <div className="rounded-2xl border border-indigo-200 bg-linear-to-br from-indigo-50 to-indigo-100 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-indigo-500 p-3">
                  <Link className="size-6 text-white" />
                </div>
                <div className="text-indigo-600">
                  <ExternalLink className="size-6" />
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-indigo-700">
                  Links Clicked
                </p>
                <p className="text-3xl font-bold text-indigo-900">
                  {analytics.totalLinksClicked.toLocaleString()}
                </p>
              </div>
            </div>

            {/* QR scans */}
            <div className="rounded-2xl border border-teal-200 bg-linear-to-br from-teal-50 to-teal-100 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-teal-500 p-3">
                  <QrCode className="size-6 text-white" />
                </div>
                <div className="text-teal-600">
                  <TrendingUp className="size-6" />
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-teal-700">
                  QR Scans
                </p>
                <p className="text-3xl font-bold text-teal-900">
                  {analytics.qrScans.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Activity period */}
            <div className="rounded-2xl border border-orange-200 bg-linear-to-br from-orange-50 to-orange-100 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-orange-500 p-3">
                  <Calendar className="size-6 text-white" />
                </div>
                <div className="text-orange-600">
                  <Clock className="size-6" />
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-orange-700">
                  Last Activity
                </p>
                <p className="text-3xl font-bold text-orange-900">
                  {formDate({ dateString: analytics.lastClick })}
                </p>
              </div>
            </div>
          </div>

          {/* Additional metrics */}
          {(analytics.topLinkTitle || analytics.topReferrer) && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Top performing link */}
              {analytics.topLinkTitle && (
                <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 p-6">
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
                <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 p-6">
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
    </div>
  );
};

export default DashboardMetrics;
