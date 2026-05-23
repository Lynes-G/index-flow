import { ShieldCheck, Sparkles } from "lucide-react";

import { type Plan } from "@/lib/entitlements";

type DashboardRailBillingCardProps = {
  effectivePlan: Plan;
  grantedPlan?: Plan | null;
};

const planDisplayLabels: Record<Plan, string> = {
  free: "Free",
  pro: "Pro",
  ultra: "Ultra",
};

const DashboardRailBillingCard = ({
  effectivePlan,
  grantedPlan,
}: DashboardRailBillingCardProps) => {
  return (
    <section className="space-y-4 rounded-[1.55rem] border border-slate-200/80 bg-white/88 p-4">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
          Access summary
        </p>
        <h2 className="font-['Sora',sans-serif] text-xl font-semibold tracking-[-0.04em] text-slate-900">
          Your plan controls what opens up
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Billing is paused, so this panel focuses on the access your account
          currently has rather than checkout steps.
        </p>
      </div>

      <div className="grid gap-3">
        <div className="rounded-[1.2rem] border border-slate-200/80 bg-slate-50/90 p-3">
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Effective plan
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {planDisplayLabels[effectivePlan]}
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-slate-200/80 bg-slate-50/90 p-3">
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Invite grant
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            {grantedPlan
              ? `An admin grant is active for ${planDisplayLabels[grantedPlan]}.`
              : "No admin invite grant is active on this account."}
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-[1.2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,0.95))] p-3">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-accent)]" />
          <p className="text-sm leading-6 text-slate-600">
            Paid upgrades are paused, so invite grants are the only way to
            raise access beyond your direct subscription.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-accent)]" />
          <p className="text-sm leading-6 text-slate-600">
            Think of this page like a membership desk: it explains what your
            account can enter right now.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardRailBillingCard;
