import { dashboardSurfaceClasses } from "@/components/dashboard/styles";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/frontend/shared/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type DashboardGuidedEmptyStateAction = {
  href?: string;
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  icon?: LucideIcon;
};

type DashboardGuidedEmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  steps: Array<{
    title: string;
    description: string;
  }>;
  actions?: DashboardGuidedEmptyStateAction[];
  note?: ReactNode;
  className?: string;
};

const actionClassNames = {
  primary:
    "h-11 rounded-lg bg-brand-eggplant px-5 text-sm font-semibold text-white hover:bg-[color-mix(in_srgb,var(--brand-eggplant)_88%,black)]",
  secondary:
    "h-11 rounded-lg border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50",
} as const;

const guidedStepCardClassName = `${dashboardSurfaceClasses.inset} bg-white/82 p-4 shadow-sm shadow-slate-900/5`;

const guidedNoteClassName = `${dashboardSurfaceClasses.inset} bg-slate-50/90 p-4 text-sm leading-6 text-slate-600`;

const DashboardGuidedEmptyState = ({
  eyebrow,
  title,
  description,
  icon: Icon,
  steps,
  actions = [],
  note,
  className,
}: DashboardGuidedEmptyStateProps) => {
  return (
    <section
      className={cn(dashboardSurfaceClasses.card, "p-4 sm:p-6", className)}
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex size-14 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-700 shadow-sm">
            <Icon className="size-6" />
          </div>
          <div className="min-w-0 space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
              {eyebrow}
            </p>
            <div className="space-y-2">
              <h2 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                {title}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className={guidedStepCardClassName}>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {step.title}
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {note ? <div className={guidedNoteClassName}>{note}</div> : null}

        {actions.length > 0 ? (
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {actions.map((action) => {
              const ActionIcon = action.icon ?? ArrowRight;
              const className = actionClassNames[action.variant ?? "secondary"];

              if (action.href) {
                return (
                  <Button key={action.label} asChild className={className}>
                    <Link href={action.href}>
                      {action.label}
                      <ActionIcon className="size-4" />
                    </Link>
                  </Button>
                );
              }

              return (
                <Button
                  key={action.label}
                  type="button"
                  className={className}
                  onClick={action.onClick}
                >
                  {action.label}
                  <ActionIcon className="size-4" />
                </Button>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default DashboardGuidedEmptyState;
