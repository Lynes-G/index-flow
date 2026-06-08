import { ShieldCheck, Sparkles } from "lucide-react";

import {
  DashboardRailCard,
  DashboardRailHeader,
  DashboardRailPanel,
} from "@/components/dashboard/rail/shared";
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

const billingNotes = [
  {
    body: "Invite grants can raise access while billing is paused.",
    icon: ShieldCheck,
  },
  {
    body: "This panel summarizes your current access.",
    icon: Sparkles,
  },
] as const;

const billingNotesPanelClassName =
  "hidden space-y-3 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,0.95))] sm:block";

const DashboardRailBillingCard = ({
  effectivePlan,
  grantedPlan,
}: DashboardRailBillingCardProps) => {
  return (
    <DashboardRailCard>
      <DashboardRailHeader
        eyebrow="Access summary"
        title="See what your plan unlocks"
        description="See what your account can access now."
      />

      <div className="grid gap-2.5 sm:gap-3">
        <DashboardRailPanel>
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Effective plan
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">
            {planDisplayLabels[effectivePlan]}
          </p>
        </DashboardRailPanel>

        <DashboardRailPanel>
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Invite grant
          </p>
          <p className="mt-1 text-[13px] leading-5 text-slate-700 sm:text-sm sm:leading-6">
            {grantedPlan
              ? `Admin grant: ${planDisplayLabels[grantedPlan]}.`
              : "No admin invite grant active."}
          </p>
        </DashboardRailPanel>
      </div>

      <DashboardRailPanel className={billingNotesPanelClassName}>
        {billingNotes.map(({ body, icon: Icon }) => (
          <div key={body} className="flex items-start gap-3">
            <Icon className="text-brand-accent mt-0.5 size-4 shrink-0" />
            <p className="text-sm leading-6 text-slate-600">{body}</p>
          </div>
        ))}
      </DashboardRailPanel>
    </DashboardRailCard>
  );
};

export default DashboardRailBillingCard;
