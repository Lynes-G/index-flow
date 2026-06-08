import * as React from "react";
import { DashboardMobileDock } from "@/components/dashboard/shell/DashboardSidebar";

type DashboardShellProps = {
  sidebar: React.ReactNode;
  rail: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const shellGridClass =
  "flex flex-col gap-5 xl:grid xl:grid-cols-[276px_minmax(0,1.65fr)_360px] xl:items-start xl:gap-8 2xl:grid-cols-[296px_minmax(0,1.7fr)_390px]";

const desktopStickyAsideClassName =
  "hidden xl:block xl:min-w-0 xl:self-start xl:sticky xl:top-8 2xl:top-10";

const headerCardClassName =
  "dashboard-flat-surface overflow-hidden rounded-lg p-4 sm:p-6";

const headerDotClassNames = [
  "bg-brand-accent",
  "bg-brand-neon",
  "bg-brand-purple",
];

const headerActionGroupClassName =
  "flex w-full flex-col items-stretch gap-2 rounded-lg border border-[color:color-mix(in_srgb,var(--brand-eggplant)_18%,transparent)] bg-white/72 p-1.5 *:w-full *:justify-center sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:bg-transparent sm:p-0 sm:*:w-auto";

const DashboardShellHeader = ({
  title,
  description,
  actions,
}: Pick<DashboardShellProps, "title" | "description" | "actions">) => (
  <div className={headerCardClassName}>
    <div className="mb-2 flex gap-1.5 sm:mb-4" aria-hidden="true">
      {headerDotClassNames.map((className) => (
        <span
          key={className}
          className={`border-brand-eggplant size-2.5 rounded-full border ${className}`}
        />
      ))}
    </div>
    <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-2 sm:space-y-3">
        <p className="text-brand-purple text-[11px] font-black tracking-[0.22em] uppercase">
          Dashboard workspace
        </p>
        <div className="space-y-1 sm:space-y-2">
          <h1 className="font-['Sora',sans-serif] text-[1.55rem] leading-[1.08] font-black tracking-normal text-slate-900 sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-[13px] leading-5 text-slate-600 sm:text-base sm:leading-6">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className={headerActionGroupClassName}>{actions}</div>
      ) : null}
    </div>
  </div>
);

const DashboardMobileRail = ({ rail }: Pick<DashboardShellProps, "rail">) => (
  <div className="space-y-2.5 pt-1 xl:hidden">
    <div className="px-1">
      <p className="text-brand-purple text-[10px] font-black tracking-[0.2em] uppercase">
        Tips and context
      </p>
    </div>
    {rail}
  </div>
);

const DashboardShell = ({
  sidebar,
  rail,
  title,
  description,
  actions,
  children,
}: DashboardShellProps) => {
  return (
    <div className="w-full overflow-x-clip pb-36 xl:pb-10">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-3.5 sm:gap-5 2xl:px-4">
        <section className="dashboard-shell dashboard-no-bg-patterns dashboard-shell-inner">
          <div className={shellGridClass}>
            <aside className={desktopStickyAsideClassName}>{sidebar}</aside>

            <div className="min-w-0 space-y-3.5 sm:space-y-5">
              <DashboardShellHeader
                title={title}
                description={description}
                actions={actions}
              />

              <div className="min-w-0">{children}</div>

              <DashboardMobileRail rail={rail} />
            </div>

            <aside className={desktopStickyAsideClassName}>{rail}</aside>
          </div>
        </section>
      </div>
      <DashboardMobileDock />
    </div>
  );
};

export default DashboardShell;
