import * as React from "react";

type DashboardShellProps = {
  sidebar: React.ReactNode;
  rail: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const DashboardShell = ({
  sidebar,
  rail,
  title,
  description,
  actions,
  children,
}: DashboardShellProps) => {
  return (
    <div className="w-full pb-10">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 2xl:px-4">
        <section className="dashboard-shell dashboard-shell-inner">
          <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.65fr)_minmax(260px,0.95fr)] xl:items-start xl:gap-8">
            <aside className="hidden xl:block xl:min-w-0">{sidebar}</aside>

            <div className="min-w-0 space-y-6">
              <div className="rounded-[1.75rem] border border-[color:color-mix(in_srgb,var(--brand-eggplant)_10%,white)] bg-white/80 p-5 shadow-[0_16px_40px_rgba(59,21,42,0.06)] backdrop-blur-sm sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl space-y-3">
                    <p className="text-[11px] font-semibold tracking-[0.26em] text-slate-500 uppercase">
                      Dashboard workspace
                    </p>
                    <div className="space-y-2">
                      <h1 className="font-['Sora',sans-serif] text-3xl leading-tight font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
                        {title}
                      </h1>
                      {description ? (
                        <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                          {description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {actions ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {actions}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4 xl:hidden">
                <div className="rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--brand-eggplant)_10%,white)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,250,240,0.9))] p-4 shadow-[0_14px_36px_rgba(59,21,42,0.06)]">
                  <p className="mb-3 text-[11px] font-semibold tracking-[0.24em] text-slate-500 uppercase">
                    Task navigation
                  </p>
                  {sidebar}
                </div>

                <div className="rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--brand-eggplant)_10%,white)] bg-white/82 p-4 shadow-[0_14px_36px_rgba(59,21,42,0.06)]">
                  <p className="mb-3 text-[11px] font-semibold tracking-[0.24em] text-slate-500 uppercase">
                    Context panel
                  </p>
                  {rail}
                </div>
              </div>

              <div className="min-w-0">{children}</div>
            </div>

            <aside className="hidden xl:block xl:min-w-0">{rail}</aside>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardShell;
