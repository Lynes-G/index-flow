import AdminInviteManager from "@/components/AdminInviteManager";
import BillingOverview from "@/components/billing/billing-overview";
import BillingTrustNotes from "@/components/billing/billing-trust-notes";
import { isAdminUserId } from "@/lib/admin";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";
import { PricingTable } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const BillingPage = async () => {
  const { userId } = await auth();
  const entitlements = await getCurrentUserEntitlements();
  const isAdmin = isAdminUserId(userId);

  return (
    <div className="space-y-8 pb-10">
      <BillingOverview
        effectivePlan={entitlements.effectivePlan}
        grantedPlan={entitlements.grantedPlan}
      />

      <section className="editorial-surface overflow-hidden px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <div className="mb-6 max-w-2xl space-y-3">
          <p className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--brand-accent-strong)] uppercase">
            Choose your plan
          </p>
          <h2 className="font-['Sora',sans-serif] text-3xl leading-tight font-semibold tracking-[-0.06em] text-slate-900">
            Compare pricing in a lighter dashboard surface, not a marketing page.
          </h2>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            The visual language now matches the landing page more closely, but
            the billing decision still happens here, inside your logged-in
            workspace.
          </p>
        </div>
        <div className="template-card rounded-[1.75rem] p-2 sm:p-4">
          <PricingTable />
        </div>
      </section>

      <BillingTrustNotes />

      {isAdmin && userId ? (
        <section className="template-card rounded-[2rem] px-4 py-5 sm:px-6 sm:py-6">
          <div className="mb-5 max-w-2xl space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.26em] text-slate-500 uppercase">
              Admin access management
            </p>
            <h2 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em] text-slate-900">
              Invite-based plan grants
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              These controls stay visually separate from normal billing so the
              main pricing decision remains easier to scan and compare.
            </p>
          </div>
          <AdminInviteManager currentUserId={userId} />
        </section>
      ) : null}
    </div>
  );
};

export default BillingPage;
