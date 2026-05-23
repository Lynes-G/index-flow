import { CreditCard } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import AdminInviteManager from "@/components/AdminInviteManager";
import BillingOverview from "@/components/billing/billing-overview";
import BillingTrustNotes from "@/components/billing/billing-trust-notes";
import { DashboardContextRail } from "@/components/dashboard/DashboardContextRail";
import DashboardRailBillingCard from "@/components/dashboard/DashboardRailBillingCard";
import DashboardRailProfileCard from "@/components/dashboard/DashboardRailProfileCard";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { isAdminUserId } from "@/lib/admin";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";

const DashboardBillingPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const entitlements = await getCurrentUserEntitlements();
  const isAdmin = isAdminUserId(userId);

  return (
    <DashboardShell
      sidebar={<DashboardSidebar currentTask="billing" />}
      rail={
        <DashboardContextRail className="space-y-5">
          <DashboardRailProfileCard />
          <DashboardRailBillingCard
            effectivePlan={entitlements.effectivePlan}
            grantedPlan={entitlements.grantedPlan}
          />
        </DashboardContextRail>
      }
      title="Understand your current access while billing is paused"
      description="Use this billing workspace to see the plan your account is operating on, what invite grants are active, and how access changes are handled right now."
      actions={
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
          <CreditCard className="size-4" />
          Billing workspace
        </span>
      }
    >
      <div className="space-y-6">
        <BillingOverview
          effectivePlan={entitlements.effectivePlan}
          grantedPlan={entitlements.grantedPlan}
        />

        <BillingTrustNotes />

        {isAdmin ? (
          <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/92 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="mb-5 max-w-2xl space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.26em] text-slate-500 uppercase">
                Admin access management
              </p>
              <h2 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em] text-slate-900">
                Invite-based plan grants
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                These controls stay separate from the account summary so the
                main access story remains easy to scan first.
              </p>
            </div>
            <AdminInviteManager currentUserId={userId} />
          </section>
        ) : null}
      </div>
    </DashboardShell>
  );
};

export default DashboardBillingPage;
