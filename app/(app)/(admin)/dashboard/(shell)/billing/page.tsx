import { ArrowDownToLine, CreditCard } from "lucide-react";

import AdminInviteManager from "@/components/dashboard/invites/AdminInviteManager";
import BillingOverview from "@/components/dashboard/billing/BillingOverview";
import BillingTrustNotes from "@/components/dashboard/billing/BillingTrustNotes";
import DashboardDevPreviewNotice from "@/components/dashboard/shell/DashboardDevPreviewNotice";
import { DashboardContextRail } from "@/components/dashboard/shell/DashboardContextRail";
import DashboardRailBillingCard from "@/components/dashboard/rail/DashboardRailBillingCard";
import DashboardRailProfileCard from "@/components/dashboard/rail/DashboardRailProfileCard";
import DashboardShell from "@/components/dashboard/shell/DashboardShell";
import DashboardSidebar from "@/components/dashboard/shell/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { isAdminUserId } from "@/lib/admin";
import { getDashboardShellAccess } from "@/lib/server/dashboardShellAccess";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";

const DashboardBillingPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { isDevPreview, userId } = await getDashboardShellAccess({
    pathname: "/dashboard/billing",
    searchParams,
  });

  const entitlements = await getCurrentUserEntitlements();
  const isAdmin = isAdminUserId(userId);

  return (
    <DashboardShell
      sidebar={<DashboardSidebar currentTask="billing" />}
      rail={
        <DashboardContextRail className="space-y-4 sm:space-y-5">
          <DashboardRailProfileCard />
          <DashboardRailBillingCard
            effectivePlan={entitlements.effectivePlan}
            grantedPlan={entitlements.grantedPlan}
          />
        </DashboardContextRail>
      }
      title="Review your current access"
      description="View your plan and access."
      actions={
        <Button asChild size="sm">
          <a href={isAdmin ? "#admin-invite-tools" : "#billing-access-summary"}>
            {isAdmin ? (
              <>
                <CreditCard className="size-4" />
                Jump to invite tools
              </>
            ) : (
              <>
                <ArrowDownToLine className="size-4" />
                Open access summary
              </>
            )}
          </a>
        </Button>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        {isDevPreview ? (
          <DashboardDevPreviewNotice description="Billing uses sample data in preview mode." />
        ) : null}
        <div id="billing-access-summary">
          <BillingOverview
            effectivePlan={entitlements.effectivePlan}
            grantedPlan={entitlements.grantedPlan}
          />
        </div>

        <BillingTrustNotes />

        {isAdmin && userId ? (
          <section
            id="admin-invite-tools"
            className="dashboard-product-card bg-white/92 p-4 sm:p-6"
          >
            <div className="mb-4 max-w-2xl space-y-2 sm:mb-5">
              <p className="text-[11px] font-semibold tracking-[0.26em] text-slate-500 uppercase">
                Admin access management
              </p>
              <h2 className="font-['Sora',sans-serif] text-[1.45rem] font-semibold tracking-[-0.05em] text-slate-900 sm:text-2xl">
                Invite-based plan grants
              </h2>
            </div>
            <AdminInviteManager currentUserId={userId} />
          </section>
        ) : null}
      </div>
    </DashboardShell>
  );
};

export default DashboardBillingPage;
