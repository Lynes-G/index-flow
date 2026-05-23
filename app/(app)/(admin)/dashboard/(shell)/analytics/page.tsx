import { Activity } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import DashboardMetrics from "@/components/DashboardMetrics";
import { DashboardContextRail } from "@/components/dashboard/DashboardContextRail";
import DashboardRailAnalyticsSummary from "@/components/dashboard/DashboardRailAnalyticsSummary";
import DashboardRailProfileCard from "@/components/dashboard/DashboardRailProfileCard";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { fetchAnalytics, type AnalyticsData } from "@/lib/fetchAnalytics";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";

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

const DashboardAnalyticsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const entitlements = await getCurrentUserEntitlements();
  const analytics = entitlements.canAccessAnalytics
    ? await fetchAnalytics(userId)
    : emptyAnalytics;

  return (
    <DashboardShell
      sidebar={<DashboardSidebar currentTask="analytics" />}
      rail={
        <DashboardContextRail className="space-y-5">
          <DashboardRailProfileCard />
          <DashboardRailAnalyticsSummary
            analytics={analytics}
            canAccessAnalytics={entitlements.canAccessAnalytics}
            canAccessUltraFeatures={entitlements.canAccessUltraFeatures}
          />
        </DashboardContextRail>
      }
      title="Review how your public page is performing"
      description="Use this analytics workspace to read the last 30 days of profile activity without the old stacked-page framing getting in the way."
      actions={
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
          <Activity className="size-4" />
          Analytics workspace
        </span>
      }
    >
      <DashboardMetrics
        analytics={analytics}
        canAccessAnalytics={entitlements.canAccessAnalytics}
        canAccessUltraFeatures={entitlements.canAccessUltraFeatures}
      />
    </DashboardShell>
  );
};

export default DashboardAnalyticsPage;
