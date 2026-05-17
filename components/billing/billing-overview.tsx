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

export default function BillingOverview({
  effectivePlan,
  grantedPlan,
}: BillingOverviewProps) {
  const planLabel = planDisplayLabels[effectivePlan];
  const grantLabel = grantedPlan ? planDisplayLabels[grantedPlan] : null;

  return (
    <section className="template-noise editorial-surface relative overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
      <div className="template-glow-ring template-pulse left-[8%] top-6 h-44 w-44 bg-[rgba(251,176,59,0.22)]" />
      <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--brand-accent-strong)] uppercase">
              Billing overview
            </p>
            <h1 className="max-w-3xl font-['Sora',sans-serif] text-3xl leading-tight font-semibold tracking-[-0.06em] text-slate-900 sm:text-4xl">
              Review your account access while billing is paused.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Your current plan still determines what the dashboard unlocks, but
              paid upgrades are temporarily disabled. Admin invite grants remain
              active and can still raise account access.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="template-card rounded-[1.5rem] p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Effective plan
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-900">
                {planLabel}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This is the access level your account can use right now across
                the dashboard.
              </p>
            </div>

            <div className="template-accent-card rounded-[1.5rem] p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#39270c] uppercase">
                Invite grant status
              </p>
              <p className="mt-3 text-sm leading-7 text-[#33230b]">
                {grantLabel
                  ? `Your account currently includes an admin invite grant for ${grantLabel}. That grant can raise the effective plan above a direct subscription while it remains active.`
                  : "There is no active admin invite grant on this account, so your current access reflects your direct subscription and available product entitlements."}
              </p>
            </div>
          </div>
        </div>

        <aside className="template-card rounded-[1.75rem] p-5">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Access status
              </p>
              <p className="text-lg font-semibold text-slate-900">
                Invite-only upgrades
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            <div className="flex items-start gap-3">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-accent)]"
              />
              <p>
                Checkout is disabled for now, so this page only reports your
                current access and any invite-based grant on the account.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-accent)]"
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
