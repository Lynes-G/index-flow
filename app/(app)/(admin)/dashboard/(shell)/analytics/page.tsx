import DashboardMetrics from "@/components/dashboard/analytics/DashboardMetrics";
import DashboardDevPreviewNotice from "@/components/dashboard/shell/DashboardDevPreviewNotice";
import { DashboardContextRail } from "@/components/dashboard/shell/DashboardContextRail";
import DashboardRailAnalyticsSummary from "@/components/dashboard/rail/DashboardRailAnalyticsSummary";
import DashboardRailProfileCard from "@/components/dashboard/rail/DashboardRailProfileCard";
import DashboardShell from "@/components/dashboard/shell/DashboardShell";
import DashboardSidebar from "@/components/dashboard/shell/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import {
  fetchAnalytics,
  type AnalyticsData,
} from "@/lib/frontend/analytics/fetchAnalytics";
import { getAppUrl } from "@/lib/server/appUrl";
import { getDashboardShellAccess } from "@/lib/server/dashboardShellAccess";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";
import { fetchQuery } from "convex/nextjs";
import { Activity, ExternalLink } from "lucide-react";
import Link from "next/link";

const emptyAnalytics: AnalyticsData = {
  totalClicks: 0,
  uniqueVisitors: 0,
  countriesReached: 0,
  totalLinksClicked: 0,
  qrScans: 0,
  topLinkTitle: null,
  topReferrer: null,
  firstClick: null,
  lastClick: null,
};

const sampleAnalytics: AnalyticsData = {
  totalClicks: 148,
  uniqueVisitors: 93,
  countriesReached: 7,
  totalLinksClicked: 112,
  qrScans: 18,
  topLinkTitle: "Portfolio",
  topReferrer: "https://instagram.com",
  firstClick: "2026-05-03T09:00:00.000Z",
  lastClick: "2026-05-29T18:30:00.000Z",
};

const DashboardAnalyticsPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { isDevPreview, userId } = await getDashboardShellAccess({
    pathname: "/dashboard/analytics",
    searchParams,
  });

  const entitlements = await getCurrentUserEntitlements();
  const currentSlug = userId
    ? await fetchQuery(api.lib.usernames.getUserSlug, {
        userId,
      })
    : null;
  const linkCount = userId
    ? await fetchQuery(api.lib.links.getLinkCountByUserId, {
        userId,
      })
    : 0;
  const realAnalytics =
    userId && entitlements.canAccessAnalytics
      ? await fetchAnalytics(userId)
      : emptyAnalytics;
  const analytics = isDevPreview ? sampleAnalytics : realAnalytics;
  const resolvedSlug = currentSlug ?? userId ?? "your-profile";
  const publicPageHref = `/u/${resolvedSlug}`;
  const publicPageLabel = `${getAppUrl()}/u/${resolvedSlug}`;

  return (
    <DashboardShell
      sidebar={<DashboardSidebar currentTask="analytics" />}
      rail={
        <DashboardContextRail className="space-y-4 sm:space-y-5">
          <DashboardRailProfileCard />
          <DashboardRailAnalyticsSummary
            analytics={analytics}
            canAccessAnalytics={entitlements.canAccessAnalytics}
            canAccessUltraFeatures={entitlements.canAccessUltraFeatures}
            isSampleMode={isDevPreview}
          />
        </DashboardContextRail>
      }
      title="Track page performance"
      description="See what starts working after people visit your page and tap through your links."
      actions={
        <Button asChild size="sm">
          <Link
            href={publicPageHref}
            target="_blank"
            rel="noopener noreferrer"
            title={publicPageLabel}
          >
            <Activity className="size-4" />
            Open tracked page
            <ExternalLink className="size-4" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-3.5 sm:space-y-5">
        {isDevPreview ? (
          <DashboardDevPreviewNotice description="Analytics stays in sample mode in preview." />
        ) : null}
        <DashboardMetrics
          analytics={analytics}
          canAccessAnalytics={entitlements.canAccessAnalytics}
          canAccessUltraFeatures={entitlements.canAccessUltraFeatures}
          publicPageHref={publicPageHref}
          linkCount={linkCount}
          isSampleMode={isDevPreview}
        />
      </div>
    </DashboardShell>
  );
};

export default DashboardAnalyticsPage;
