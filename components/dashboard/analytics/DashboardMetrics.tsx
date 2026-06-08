import type { AnalyticsData } from "@/lib/frontend/analytics/fetchAnalytics";
import DashboardGuidedEmptyState from "@/components/dashboard/setup/DashboardGuidedEmptyState";
import { dashboardMetricClasses } from "@/components/dashboard/styles";
import {
  formatAnalyticsDate,
  normalizeAnalyticsText,
} from "@/lib/frontend/analytics/analyticsFormatting";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Clock,
  Eye,
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
import type { LucideIcon } from "lucide-react";

interface DashboardMetricsProps {
  analytics: AnalyticsData;
  canAccessAnalytics: boolean;
  canAccessUltraFeatures: boolean;
  publicPageHref?: string;
  linkCount?: number;
  isSampleMode?: boolean;
}

type MetricTone = {
  icon: string;
  secondaryIcon: string;
};

type MetricCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  secondaryIcon: LucideIcon;
  tone: MetricTone;
};

const sampleAnalyticsQuestions = [
  {
    title: "Which link earns the most taps?",
    answer:
      "Use total clicks and top link highlights to learn what deserves the top slot on your page.",
    icon: MousePointer,
  },
  {
    title: "Where is your audience finding you?",
    answer:
      "Referrer and visitor counts show whether Instagram, direct shares, or other channels send the best traffic.",
    icon: Users,
  },
  {
    title: "Is sharing beyond social starting to work?",
    answer:
      "QR scans and country reach help you spot when offline sharing or wider distribution starts paying off.",
    icon: Globe,
  },
] as const;

const sampleModePanelClassName =
  "dashboard-product-card bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand-accent)_10%,white),rgba(255,251,239,0.96))] p-3.5 sm:p-5";

const analyticsStatusBadgeClassName =
  "border-brand-eggplant inline-flex w-fit max-w-full rounded-md border bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-slate-700 uppercase";

const formatReferrer = (referrer: string | null) => {
  if (!referrer || referrer === "direct") return "Direct";

  try {
    const url = new URL(referrer);
    return url.hostname.replace("www.", "");
  } catch {
    return referrer;
  }
};

const createVisibleMetrics = (
  analytics: AnalyticsData,
  lastActivityLabel: string,
): MetricCardProps[] => [
  {
    label: "Profile Views",
    value: analytics.profileViews.toLocaleString(),
    icon: Eye,
    secondaryIcon: TrendingUp,
    tone: {
      icon: "bg-violet-50/95 text-violet-600",
      secondaryIcon: "text-violet-200",
    },
  },
  {
    label: "Total Clicks",
    value: analytics.totalClicks.toLocaleString(),
    icon: MousePointer,
    secondaryIcon: TrendingUp,
    tone: {
      icon: "bg-blue-50/95 text-blue-600",
      secondaryIcon: "text-blue-200",
    },
  },
  {
    label: "Unique Visitors",
    value: analytics.uniqueVisitors.toLocaleString(),
    icon: Users,
    secondaryIcon: TrendingUp,
    tone: {
      icon: "bg-indigo-50/95 text-indigo-600",
      secondaryIcon: "text-indigo-200",
    },
  },
  {
    label: "Links Clicked",
    value: analytics.totalLinksClicked.toLocaleString(),
    icon: Link,
    secondaryIcon: ExternalLink,
    tone: {
      icon: "bg-sky-50/95 text-sky-600",
      secondaryIcon: "text-sky-200",
    },
  },
  {
    label: "QR Scans",
    value: analytics.qrScans.toLocaleString(),
    icon: QrCode,
    secondaryIcon: TrendingUp,
    tone: {
      icon: "bg-cyan-50/95 text-cyan-600",
      secondaryIcon: "text-cyan-200",
    },
  },
  {
    label: "Last Activity",
    value: lastActivityLabel,
    icon: Calendar,
    secondaryIcon: Clock,
    tone: {
      icon: "bg-orange-50/95 text-orange-600",
      secondaryIcon: "text-orange-200",
    },
  },
];

const MetricCard = ({
  label,
  value,
  icon: Icon,
  secondaryIcon: SecondaryIcon,
  tone,
}: MetricCardProps) => (
  <div className={dashboardMetricClasses.card}>
    <div className="mb-4 flex items-center justify-between sm:mb-5">
      <div className={`${dashboardMetricClasses.icon} ${tone.icon}`}>
        <Icon className="size-6" />
      </div>
      <div className={tone.secondaryIcon}>
        <SecondaryIcon className="size-6" />
      </div>
    </div>
    <div>
      <p className="mb-1 text-sm font-medium text-slate-600">{label}</p>
      <p className="text-xl font-bold text-slate-900 sm:text-3xl">{value}</p>
    </div>
  </div>
);

const DashboardMetrics = ({
  analytics,
  canAccessAnalytics,
  canAccessUltraFeatures,
  publicPageHref = "/dashboard",
  linkCount = 0,
  isSampleMode = false,
}: DashboardMetricsProps) => {
  const hasActivity =
    analytics.profileViews > 0 ||
    analytics.totalClicks > 0 ||
    analytics.uniqueVisitors > 0 ||
    analytics.totalLinksClicked > 0 ||
    analytics.qrScans > 0;
  const hasHighlights = Boolean(
    normalizeAnalyticsText(analytics.topLinkTitle) ||
      normalizeAnalyticsText(analytics.topReferrer),
  );
  const lastActivityLabel = formatAnalyticsDate({
    dateString: analytics.lastClick,
  });
  const visibleMetrics = createVisibleMetrics(analytics, lastActivityLabel);

  if (!canAccessAnalytics && !isSampleMode) {
    return (
      <div className="space-y-5">
        <div className="grid gap-3.5 lg:grid-cols-3">
          <div className={dashboardMetricClasses.summaryPanel}>
            <MousePointer className="size-5 text-slate-500" />
            <p className="mt-3 text-sm font-semibold text-slate-900">
              Track total clicks
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Count profile and link clicks.
            </p>
          </div>

          <div className={dashboardMetricClasses.summaryPanel}>
            <Users className="size-5 text-slate-500" />
            <p className="mt-3 text-sm font-semibold text-slate-900">
              Understand visitors
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              See how many people visited.
            </p>
          </div>

          <div className={dashboardMetricClasses.summaryPanel}>
            <Globe className="size-5 text-slate-500" />
            <p className="mt-3 text-sm font-semibold text-slate-900">
              Unlock audience reach
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Ultra adds country-level reach.
            </p>
          </div>
        </div>

        <div
          className={`${dashboardMetricClasses.summaryPanel} text-sm leading-6 font-semibold text-slate-600`}
        >
          Upgrade access to unlock the full analytics view.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {isSampleMode ? (
        <div className={sampleModePanelClassName}>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-brand-accent-ink text-xs font-semibold tracking-[0.18em] uppercase">
                Sample mode
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                This preview shows example analytics, not live traffic.
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Use it to learn what the dashboard will answer once your real
                page starts getting visits.
              </p>
            </div>
            <div className="border-brand-eggplant text-brand-accent-ink inline-flex w-fit rounded-md border bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase">
              Example data
            </div>
          </div>
        </div>
      ) : null}

      <div className="dashboard-product-card flex flex-col gap-2.5 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            {isSampleMode ? "Example 30 days" : "Last 30 days"}
          </p>
          <p className="text-[13px] leading-5 text-slate-600 sm:text-sm sm:leading-6">
            {isSampleMode
              ? "A walkthrough of what this page will summarize once real visitors arrive."
              : "Your key profile numbers at a glance."}
          </p>
        </div>
        <div className={analyticsStatusBadgeClassName}>
          {isSampleMode
            ? "Sample data"
            : hasActivity
              ? "Activity tracked"
              : "Waiting for activity"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {visibleMetrics.slice(0, 2).map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}

        {canAccessUltraFeatures || isSampleMode ? (
          <div className={dashboardMetricClasses.card}>
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <div
                className={`${dashboardMetricClasses.icon} bg-emerald-50/95 text-emerald-600`}
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
              <p className="text-xl font-bold text-slate-900 sm:text-3xl">
                {analytics.countriesReached.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="dashboard-product-card border-emerald-200/80 bg-white/85 p-3.5 sm:p-5">
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <div
                className={`${dashboardMetricClasses.icon} bg-emerald-50/95 text-emerald-600`}
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

        {visibleMetrics.slice(2).map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      {!hasActivity && (
        <div className="space-y-4">
          <DashboardGuidedEmptyState
            eyebrow="Analytics empty state"
            title="Nothing is broken. Your page just needs real traffic."
            description="Analytics starts filling in after someone opens your public page or taps a tracked link. Think of this area like a scoreboard before the game starts."
            icon={BarChart3}
            steps={[
              {
                title:
                  linkCount > 0
                    ? "Share the page in one real place"
                    : "Add at least one real destination",
                description:
                  linkCount > 0
                    ? "Post your profile URL somewhere people already find you, like Instagram, TikTok, email signatures, or your portfolio."
                    : "Give visitors something useful to click first, such as your portfolio, shop, booking page, or latest post.",
              },
              {
                title: "Open the live page once",
                description:
                  "Use the tracked public page to confirm the layout feels right and the analytics pipeline can start collecting activity.",
              },
              {
                title: "Check back after a few visits",
                description:
                  "Once traffic starts, this view will show clicks, visitors, top links, and where your audience is coming from.",
              },
            ]}
            actions={[
              {
                label: linkCount > 0 ? "Open tracked page" : "Add links first",
                href: linkCount > 0 ? publicPageHref : "/dashboard",
                variant: "primary",
                icon: ExternalLink,
              },
              {
                label: "Review your links",
                href: "/dashboard",
                icon: ArrowRight,
              },
            ]}
            note={
              <p>
                Your own visits can help you sanity-check the setup, but the
                most useful patterns appear after real visitors start clicking.
              </p>
            }
          />

          <div className="dashboard-product-card bg-white/92 p-3.5 sm:p-5">
            <div className="mb-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                What you&apos;ll learn here
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Even before real traffic arrives, these are the questions this
                analytics space is built to answer.
              </p>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              {sampleAnalyticsQuestions.map(({ title, answer, icon: Icon }) => (
                <div
                  key={title}
                  className="dashboard-product-inset bg-slate-50/80 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-brand-eggplant rounded-xl bg-white p-2 shadow-sm">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasHighlights && (
        <div className="dashboard-product-card space-y-3 bg-slate-50/88 p-3.5 sm:space-y-4 sm:p-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Highlights
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
            {normalizeAnalyticsText(analytics.topLinkTitle) && (
              <div className={dashboardMetricClasses.summaryPanel}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-slate-900 p-2 text-white">
                    <ExternalLink className="size-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    Top Performing Link
                  </h3>
                </div>
                <p className="font-medium break-words text-slate-700">
                  {normalizeAnalyticsText(analytics.topLinkTitle)}
                </p>
              </div>
            )}

            {normalizeAnalyticsText(analytics.topReferrer) && (
              <div className={dashboardMetricClasses.summaryPanel}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-slate-900 p-2 text-white">
                    <Globe className="size-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Top Referrer</h3>
                </div>
                <p className="font-medium break-all text-slate-700">
                  {formatReferrer(
                    normalizeAnalyticsText(analytics.topReferrer),
                  )}
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
