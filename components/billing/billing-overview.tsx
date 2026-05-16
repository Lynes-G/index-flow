import { type Plan } from "@/lib/entitlements";
import { CreditCard, ShieldCheck, Sparkles } from "lucide-react";

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
              Manage your plan inside the same lighter product language.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Review your current access, then compare pricing without losing
              context. Plan changes still route through Clerk&apos;s hosted flow
              when you decide to act.
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
            <div className="rounded-2xl bg-[rgba(251,176,59,0.12)] p-3 text-[color:var(--brand-accent)]">
              <CreditCard aria-hidden="true" className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Hosted billing flow
              </p>
              <p className="text-lg font-semibold text-slate-900">
                Secure plan changes
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
                Pricing and checkout still live inside Clerk&apos;s hosted
                experience instead of a custom payment form on this page.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-accent)]"
              />
              <p>
                The surface is lighter and sharper, but the goal stays the same:
                understand your access first, then make a change only when it
                feels straightforward.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
