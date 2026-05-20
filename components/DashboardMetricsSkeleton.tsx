import { AdminPageShell } from "@/components/dashboard/AdminShell";

const DashboardMetricsSkeleton = () => {
  return (
    <AdminPageShell>
      <div className="dashboard-shell dashboard-shell-inner">
        <div className="mb-6 space-y-3 sm:mb-8">
          <div className="h-3 w-24 rounded-full bg-slate-200" />
          <div className="h-7 w-52 rounded-full bg-slate-300" />
          <div className="h-4 w-64 rounded-full bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`metric-skeleton-${index}`}
              className="rounded-[1.35rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm shadow-slate-900/5 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between sm:mb-5">
                <div className="h-11 w-11 rounded-2xl bg-slate-200" />
                <div className="h-6 w-6 rounded-full bg-slate-200" />
              </div>
              <div>
                <div className="mb-2 h-3 w-24 rounded-full bg-slate-200" />
                <div className="h-8 w-20 rounded-full bg-slate-300" />
              </div>
            </div>
          ))}
        </div>
        <div className="dashboard-section-divider mt-6 pt-6 sm:mt-8 sm:pt-8">
          <div className="mb-4 space-y-2">
            <div className="h-3 w-20 rounded-full bg-slate-200" />
            <div className="h-4 w-56 rounded-full bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={`summary-skeleton-${index}`}
                className="rounded-[1.4rem] border border-slate-200/80 bg-white/72 p-4 sm:p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-200" />
                  <div className="h-4 w-32 rounded-full bg-slate-200" />
                </div>
                <div className="h-4 w-40 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
};

export default DashboardMetricsSkeleton;
