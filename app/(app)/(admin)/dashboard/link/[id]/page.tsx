import LinkAnalytics from "@/components/dashboard/analytics/LinkAnalytics";
import DashboardRailProfileCard from "@/components/dashboard/rail/DashboardRailProfileCard";
import { DashboardContextRail } from "@/components/dashboard/shell/DashboardContextRail";
import DashboardShell from "@/components/dashboard/shell/DashboardShell";
import DashboardSidebar from "@/components/dashboard/shell/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { fetchLinkAnalytics } from "@/lib/frontend/analytics/fetchLinkAnalytics";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, BarChart3, MousePointer } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/dist/client/components/navigation";

interface LinkAnalyticsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const LinkAnalyticsPage = async ({ params }: LinkAnalyticsPageProps) => {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) notFound();

  const entitlements = await getCurrentUserEntitlements();
  const analytics = await fetchLinkAnalytics(userId, id);

  if (!analytics) {
    const emptyAnalytics = {
      linkId: id,
      linkTitle: "This link has no analytics",
      linkUrl: "Please wait for analytics to generate or check back later.",
      totalClicks: 0,
      uniqueUsers: 0,
      countriesReached: 0,
      dailyData: [],
      countryData: [],
    };
    return (
      <DashboardShell
        sidebar={<DashboardSidebar currentTask="links" />}
        rail={<LinkAnalyticsRail />}
        title="Inspect link performance"
        description="Review clicks, visitor reach, and location signals for a single link."
        actions={<BackToLinksAction />}
      >
        <LinkAnalytics
          analytics={emptyAnalytics}
          canAccessAnalytics={entitlements.canAccessAnalytics}
          canAccessUltraFeatures={entitlements.canAccessUltraFeatures}
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      sidebar={<DashboardSidebar currentTask="links" />}
      rail={<LinkAnalyticsRail />}
      title="Inspect link performance"
      description="Review clicks, visitor reach, and location signals for a single link."
      actions={<BackToLinksAction />}
    >
      <LinkAnalytics
        analytics={analytics}
        canAccessAnalytics={entitlements.canAccessAnalytics}
        canAccessUltraFeatures={entitlements.canAccessUltraFeatures}
      />
    </DashboardShell>
  );
};

const BackToLinksAction = () => (
  <Button asChild size="sm">
    <Link href="/dashboard">
      <ArrowLeft className="size-4" />
      Back to links
    </Link>
  </Button>
);

const LinkAnalyticsRail = () => (
  <DashboardContextRail className="space-y-5">
    <DashboardRailProfileCard />
    <div className="grid gap-2.5 xl:gap-3">
      <div className="rounded-lg border border-slate-200/80 bg-slate-50/90 p-3 xl:p-4">
        <div className="flex items-start gap-3">
          <MousePointer className="mt-0.5 size-4 text-slate-500" />
          <div className="space-y-1">
            <p className="text-[13px] font-semibold text-slate-900 sm:text-sm">
              Link-level signal
            </p>
            <p className="text-[13px] leading-5 text-slate-600 sm:text-sm">
              Use this detail view to decide whether a link should move higher,
              get renamed, or be retired.
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200/80 bg-slate-50/90 p-3 xl:p-4">
        <div className="flex items-start gap-3">
          <BarChart3 className="mt-0.5 size-4 text-slate-500" />
          <div className="space-y-1">
            <p className="text-[13px] font-semibold text-slate-900 sm:text-sm">
              Compare over time
            </p>
            <p className="text-[13px] leading-5 text-slate-600 sm:text-sm">
              Daily performance helps separate one-off taps from links that keep
              earning attention.
            </p>
          </div>
        </div>
      </div>
    </div>
  </DashboardContextRail>
);

export default LinkAnalyticsPage;
