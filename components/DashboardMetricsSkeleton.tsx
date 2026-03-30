const DashboardMetricsSkeleton = () => {
  return (
    <div className="mb-8 bg-slate-50/80 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
          <div className="mb-8">
            <div className="h-6 w-48 rounded-full bg-slate-200" />
            <div className="mt-3 h-4 w-64 rounded-full bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`metric-skeleton-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-slate-200" />
                  <div className="h-6 w-6 rounded-full bg-slate-200" />
                </div>
                <div>
                  <div className="mb-2 h-3 w-24 rounded-full bg-slate-200" />
                  <div className="h-8 w-20 rounded-full bg-slate-300" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={`summary-skeleton-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-200" />
                  <div className="h-4 w-32 rounded-full bg-slate-200" />
                </div>
                <div className="h-4 w-40 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetricsSkeleton;
