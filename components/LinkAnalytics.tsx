import { LinkAnalyticsData } from "@/lib/fetchLinkAnalytics";
import { Protect } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  BarChart3,
  ExternalLink,
  Globe,
  Lock,
  MapPin,
  MousePointer,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

interface LinkAnalyticsProps {
  analytics: LinkAnalyticsData;
}

const LinkAnalytics = async ({ analytics }: LinkAnalyticsProps) => {
  const { has } = await auth();
  const hasAnalyticsAccess = has({ feature: "analytics" });

  const formDate = ({ dateString }: { dateString: string | null }) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  if (!hasAnalyticsAccess) {
    return (
      <div className="mb-8 bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-gray-400 p-3">
                <BarChart3 className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Link Analytics
                </h2>
                <p className="text-gray-600">
                  Upgrade your plan to access detailed analytics and insights
                  about your link performance.
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4 text-gray-600">
                <MousePointer className="size-5" />
                <span>Track total clicks and engagement</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <Users className="size-5" />
                <span>See unique visitors and demographics</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <Globe className="size-5" />
                <span>Discover where your audience is located</span>
              </div>
            </div>
            <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-gray-500">
                Get detailed link analytics including total clicks, unique
                visitors, and geographic data by upgrading your plan.
              </p>
              <Link
                href="/dashboard/billing"
                className="mt-4 inline-block rounded-lg bg-linear-to-r from-purple-500 to-purple-600 px-6 py-2 font-medium text-white transition-opacity hover:opacity-90"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with back button */}
      <div className="mb-8 bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeft className="size-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
            </div>

            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {analytics.linkTitle}
              </h1>
              <Link
                href={analytics.linkUrl}
                className="flex items-center gap-2 text-gray-600"
              >
                <ExternalLink className="size-4" />
                <span className="text-sm">{formatUrl(analytics.linkUrl)}</span>
              </Link>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Total Clicks */}
              <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-blue-500 p-3">
                    <MousePointer className="size-6 text-white" />
                  </div>
                  <div className="text-blue-600">
                    <TrendingUp className="size-5" />
                  </div>
                </div>
                <p className="mb-1 text-sm font-medium text-blue-600">
                  Total Clicks
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {analytics.totalClicks.toLocaleString()}
                </p>
              </div>
              {/* Unique Users */}
              <div className="rounded-2xl border border-purple-200 bg-linear-to-br from-purple-50 to-purple-100 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-purple-500 p-3">
                    <Users className="size-6 text-white" />
                  </div>
                  <div className="text-purple-600">
                    <TrendingUp className="size-5" />
                  </div>
                </div>
                <p className="mb-1 text-sm font-medium text-purple-600">
                  Unique Users
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {analytics.uniqueUsers.toLocaleString()}
                </p>
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
                        <Lock className="size-5" />
                      </div>
                    </div>
                    <p className="mb-1 text-sm font-medium text-green-600">
                      Countries
                    </p>
                    <p className="text-3xl font-bold text-green-900">
                      Upgrade to Ultra
                    </p>
                  </div>
                }
              >
                <div className="rounded-2xl border border-green-200 bg-linear-to-br from-green-50 to-green-100 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-green-500 p-3">
                      <Globe className="size-6 text-white" />
                    </div>
                    <div className="text-green-600">
                      <MapPin className="size-5" />
                    </div>
                  </div>
                  <p className="mb-1 text-sm font-medium text-green-600">
                    Countries
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {analytics.countriesReached.toLocaleString()}
                  </p>
                </div>
              </Protect>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Performance Chart */}
      {analytics.dailyData.length > 0 && (
        <div className="mb-8 bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-2xl border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-slate-400 p-3">
                  <BarChart3 className="size-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Daily Performance
                </h2>
                <p className="text-gray-600">Last 30 days activity</p>
              </div>
              {/* Simple bar chart representation */}
              <div className="space-y-4">
                {analytics.dailyData.slice(0, 10).map((day) => {
                  const maxClicks = Math.max(
                    ...analytics.dailyData.map((d) => d.clicks),
                  );
                  const width =
                    maxClicks > 0 ? (day.clicks / maxClicks) * 100 : 0;
                  return (
                    <div key={day.date} className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium text-gray-600">
                        {formDate({ dateString: day.date })}
                      </div>
                      <div className="relative flex-1">
                        <div className="relative h-8 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-blue-500 to-purple-600 transition-all duration-500"
                            style={{ width: `${width}%` }}
                          />
                          <div className="absolute inset-0 flex items-center px-3">
                            <span className="text-sm font-medium text-white">
                              {day.clicks} clicks
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="size-4" />
                          <span>{day.uniqueUsers}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="size-4" />
                          <span>{day.countries}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {analytics.dailyData.length > 10 && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Showing last 10 days • {analytics.dailyData.length} days
                    total
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Countries Analytics */}
      <Protect
        plan="ultra"
        fallback={
          <div className="mb-8 bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-gray-400 p-3">
                    <Globe className="size-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Countries
                  </h2>
                  <p className="text-gray-600">
                    🔒 Upgrade to Ultra to unlock country analytics
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="w-full rounded-lg bg-gray-100 p-4 text-center">
                  <p className="text-gray-500">
                    This feature is available on the Ultra plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
      >
        {analytics.countryData.length > 0 && (
          <div className="mb-8 bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-green-500 p-3">
                    <Globe className="size-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Countries
                    </h2>
                    <p className="text-gray-600">
                      Click distribution by country
                    </p>
                  </div>
                </div>
                {/* Country list */}
                <div className="space-y-3">
                  {analytics.countryData.map((country) => {
                    // Use the percentage from Tinybird directly for bar width
                    const width = country.percentage || 0;

                    return (
                      <div
                        key={country.country}
                        className="flex items-center gap-4"
                      >
                        <div className="w-32 truncate text-sm font-medium text-gray-600">
                          {country.country}
                        </div>
                        <div className="relative flex-1">
                          <div className="relative h-6 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-600 transition-all duration-500"
                              style={{ width: `${width}%` }}
                            />
                            <div className="absolute inset-0 flex items-center px-3">
                              <span className="text-xs font-medium text-white">
                                {country.clicks} clicks
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-sm font-medium text-gray-600">
                            {country.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {analytics.countryData.length >= 20 && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      Showing top 20 countries
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Protect>
      {/* No data state */}
      {analytics.dailyData.length === 0 && (
        <div className="bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-2xl border-white/20 bg-white/80 p-8 text-center shadow-xl shadow-gray-200/50 backdrop-blur-sm">
              <div className="mb-4 text-gray-400">
                <BarChart3 className="mx-auto size-16" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No Analytics Data Available
              </h3>
              <p className="text-gray-600">
                Your link has not received any clicks yet. Share your link to
                start tracking its performance!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkAnalytics;
