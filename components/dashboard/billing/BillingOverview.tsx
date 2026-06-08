import { dashboardSurfaceClasses } from "@/components/dashboard/styles";
import { type Plan } from "@/lib/entitlements";
import { ShieldCheck, Sparkles } from "lucide-react";

type BillingOverviewProps = {
  effectivePlan: Plan;
  grantedPlan?: Plan | null;
};

const planDisplayLabels: Record<Plan, string> = {
  free: "Free",
  pro: "Pro",
  ultra: "Ultra",
};

const billingGrantCardClassName =
  "border-brand-eggplant text-brand-eggplant rounded-lg border-2 bg-[linear-gradient(135deg,var(--brand-neon),var(--brand-lime))] p-3.5 shadow-[5px_5px_0_color-mix(in_srgb,var(--brand-purple)_36%,transparent)] sm:p-4";

const billingNoteItemClassName = "flex items-start gap-3";

const billingNoteIconClassName = "text-brand-accent mt-0.5 size-4 shrink-0";

export default function BillingOverview({
  effectivePlan,
  grantedPlan,
}: BillingOverviewProps) {
  const planLabel = planDisplayLabels[effectivePlan];
  const grantLabel = grantedPlan ? planDisplayLabels[grantedPlan] : null;

  return (
    <section className="dashboard-flat-surface relative overflow-hidden rounded-lg px-3.5 py-4 sm:px-6 sm:py-6">
      <div className="relative space-y-4 sm:space-y-6">
        <div className="space-y-4 sm:space-y-5">
          <div className="space-y-2.5 sm:space-y-3">
            <p className="text-brand-purple text-[11px] font-semibold tracking-[0.26em] uppercase">
              Billing overview
            </p>
            <h2 className="max-w-3xl font-['Sora',sans-serif] text-[1.55rem] leading-[1.08] font-semibold tracking-[-0.05em] text-slate-900 sm:text-[2rem]">
              Review your current access.
            </h2>
            <p className="max-w-2xl text-[13px] leading-5 text-slate-600 sm:text-base sm:leading-6">
              Paid upgrades are paused, but your plan and any admin invite grant
              still determine which dashboard features are available right now.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div
              className={`${dashboardSurfaceClasses.card} ${dashboardSurfaceClasses.cardPaddingCompact}`}
            >
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Effective plan
              </p>
              <p className="mt-2.5 text-xl font-semibold tracking-[-0.05em] text-slate-900 sm:mt-3 sm:text-2xl">
                {planLabel}
              </p>
              <p className="mt-2 text-[13px] leading-5 text-slate-600 sm:text-sm sm:leading-6">
                This is the access level your account can use right now across
                the dashboard.
              </p>
            </div>

            <div className={billingGrantCardClassName}>
              <p className="text-brand-eggplant text-xs font-semibold tracking-[0.18em] uppercase">
                Invite grant status
              </p>
              <p className="mt-2.5 text-[13px] leading-5 text-[color:color-mix(in_srgb,var(--brand-eggplant)_86%,white)] sm:mt-3 sm:text-sm sm:leading-7">
                {grantLabel
                  ? `Your account currently includes an admin invite grant for ${grantLabel}. That grant can raise the effective plan above a direct subscription while it remains active.`
                  : "There is no active admin invite grant on this account, so your current access reflects your direct subscription and available product entitlements."}
              </p>
            </div>
          </div>
        </div>

        <aside
          className={`${dashboardSurfaceClasses.card} ${dashboardSurfaceClasses.cardPadding}`}
        >
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[13px] font-medium text-slate-500 sm:text-sm">
                Access status
              </p>
              <p className="text-base font-semibold text-slate-900 sm:text-lg">
                Invite-only upgrades
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3.5 text-[13px] leading-5 text-slate-600 sm:mt-5 sm:space-y-4 sm:text-sm sm:leading-6">
            <div className={billingNoteItemClassName}>
              <ShieldCheck
                aria-hidden="true"
                className={billingNoteIconClassName}
              />
              <p>
                Checkout is disabled for now, so this page only reports your
                current access and any invite-based grant on the account.
              </p>
            </div>
            <div className={billingNoteItemClassName}>
              <Sparkles
                aria-hidden="true"
                className={billingNoteIconClassName}
              />
              <p>
                If an admin sends a Pro or Ultra invite to your email address,
                claiming that invite will update your access without a paid
                subscription.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
