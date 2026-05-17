import AdminInviteManager from "@/components/AdminInviteManager";
import BillingOverview from "@/components/billing/billing-overview";
import BillingTrustNotes from "@/components/billing/billing-trust-notes";
import { isAdminUserId } from "@/lib/admin";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";
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
            Billing paused
          </p>
          <h2 className="font-['Sora',sans-serif] text-3xl leading-tight font-semibold tracking-[-0.06em] text-slate-900">
            Paid plan changes are temporarily disabled.
          </h2>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            New accounts still start on the Free plan. Pro and Ultra access can
            currently be granted only through admin-issued invites while billing
            support is offline.
          </p>
        </div>
        <div className="template-card rounded-[1.75rem] p-5 sm:p-6">
          <p className="text-sm leading-7 text-slate-600">
            Checkout and subscription changes are hidden for now. If you have
            an invite, claim it from your invite link and your account access
            will update automatically.
          </p>
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
