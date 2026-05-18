import {
  AdminPageShell,
  AdminSurface,
} from "@/components/dashboard/AdminShell";
import { LinkAnalyticsData } from "@/lib/fetchLinkAnalytics";
import { normalizeExternalUrl } from "@/lib/externalLinks";
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
  canAccessAnalytics: boolean;
  canAccessUltraFeatures: boolean;
}

const sectionSpacing = "space-y-6 pb-10";
const metricCardClass =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

const LinkAnalytics = ({
  analytics,
  canAccessAnalytics,
  canAccessUltraFeatures,
}: LinkAnalyticsProps) => {
  const analyticsLinkHref = normalizeExternalUrl(analytics.linkUrl);

  const formDate = ({ dateString }: { dateString: string | null }) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatUrl = (url: string) => {
    try {
      const safeUrl = normalizeExternalUrl(url);
      if (!safeUrl) {
        return url;
      }

      const urlObj = new URL(safeUrl);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  if (!canAccessAnalytics) {
    return (
      <div className={sectionSpacing}>
        <AdminPageShell>
          <AdminSurface className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
                <BarChart3 className="size-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Link Analytics
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  Detailed analytics are available on Pro and above while
                  billing remains paused.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-600">
                <MousePointer className="size-5" />
                <p className="mt-3 font-medium text-slate-900">
                  Track total clicks and engagement
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-600">
                <Users className="size-5" />
                <p className="mt-3 font-medium text-slate-900">
                  See unique visitors and demographics
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-600">
                <Globe className="size-5" />
                <p className="mt-3 font-medium text-slate-900">
                  Discover where your audience is located
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
              <p className="text-sm leading-6 text-slate-600">
                New accounts stay on Free by default. Pro and Ultra access
                currently come from admin-issued invites rather than direct
                checkout.
              </p>
            </div>
          </AdminSurface>
        </AdminPageShell>
      </div>
    );
  }

  return (
    <div className={sectionSpacing}>
      <AdminPageShell>
        <AdminSurface className="space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft className="size-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-slate-900">
                {analytics.linkTitle}
              </h1>
              {analyticsLinkHref ? (
                <Link
                  href={analyticsLinkHref}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
                >
                  <ExternalLink className="size-4" />
                  <span>{formatUrl(analytics.linkUrl)}</span>
                </Link>
              ) : (
                <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <ExternalLink className="size-4" />
                  <span>{formatUrl(analytics.linkUrl)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className={metricCardClass}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <MousePointer className="size-6" />
                  </div>
                  <TrendingUp className="size-5 text-blue-200" />
                </div>
                <p className="mb-1 text-sm font-medium text-slate-600">
                  Total Clicks
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.totalClicks.toLocaleString()}
                </p>
              </div>

              <div className={metricCardClass}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Users className="size-6" />
                  </div>
                  <TrendingUp className="size-5 text-indigo-200" />
                </div>
                <p className="mb-1 text-sm font-medium text-slate-600">
                  Unique Users
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.uniqueUsers.toLocaleString()}
                </p>
              </div>

              {canAccessUltraFeatures ? (
                <div className={metricCardClass}>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                      <Globe className="size-6" />
                    </div>
                    <MapPin className="size-5 text-emerald-200" />
                  </div>
                  <p className="mb-1 text-sm font-medium text-slate-600">
                    Countries
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {analytics.countriesReached.toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className={`${metricCardClass} opacity-90`}>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                      <Globe className="size-6" />
                    </div>
                    <Lock className="size-5 text-emerald-300" />
                  </div>
                  <p className="mb-1 text-sm font-medium text-slate-600">
                    Countries
                  </p>
                  <div className="mt-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                    Upgrade to Ultra
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Unlock country-level reach insights for this link.
                  </p>
                </div>
              )}
            </div>
          </div>
        </AdminSurface>
      </AdminPageShell>

      {analytics.dailyData.length > 0 && (
        <AdminPageShell>
          <AdminSurface>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-500">
                  <BarChart3 className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Daily Performance
                  </h2>
                  <p className="text-sm text-slate-600 sm:text-base">
                    Last 30 days activity
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {analytics.dailyData.slice(0, 10).map((day) => {
                const maxClicks = Math.max(
                  ...analytics.dailyData.map((d) => d.clicks),
                );
                const width = maxClicks > 0 ? (day.clicks / maxClicks) * 100 : 0;

                return (
                  <div
                    key={day.date}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 lg:flex-row lg:items-center"
                  >
                    <div className="w-20 text-sm font-medium text-slate-600">
                      {formDate({ dateString: day.date })}
                    </div>
                    <div className="relative flex-1">
                      <div className="relative h-8 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-blue-500 to-sky-500 transition-all duration-500"
                          style={{ width: `${width}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-sm font-medium text-white">
                            {day.clicks} clicks
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
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
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-center">
                <p className="text-sm text-slate-500">
                  Showing last 10 days • {analytics.dailyData.length} days total
                </p>
              </div>
            )}
          </AdminSurface>
        </AdminPageShell>
      )}

      {canAccessUltraFeatures ? (
        analytics.countryData.length > 0 && (
          <AdminPageShell>
            <AdminSurface>
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <Globe className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Countries
                  </h2>
                  <p className="text-sm text-slate-600 sm:text-base">
                    Click distribution by country
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {analytics.countryData.map((country) => {
                  const width = country.percentage || 0;

                  return (
                    <div
                      key={country.country}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <div className="w-32 truncate text-sm font-medium text-slate-600">
                        {country.country}
                      </div>
                      <div className="relative flex-1">
                        <div className="relative h-6 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500"
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
                        <span className="text-sm font-medium text-slate-600">
                          {country.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {analytics.countryData.length >= 20 && (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-center">
                  <p className="text-sm text-slate-500">
                    Showing top 20 countries
                  </p>
                </div>
              )}
            </AdminSurface>
          </AdminPageShell>
        )
      ) : (
        <AdminPageShell>
          <AdminSurface className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
                <Globe className="size-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Countries
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                  Upgrade to Ultra to unlock country analytics for each link.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
              <p className="text-sm leading-6 text-slate-600">
                This feature is available on the Ultra plan.
              </p>
            </div>
          </AdminSurface>
        </AdminPageShell>
      )}

      {analytics.dailyData.length === 0 && (
        <AdminPageShell>
          <AdminSurface className="text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <BarChart3 className="size-8" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              No analytics data available
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Your link has not received any clicks yet. Share your link to
              start tracking its performance.
            </p>
          </AdminSurface>
        </AdminPageShell>
      )}
    </div>
  );
};

export default LinkAnalytics;
