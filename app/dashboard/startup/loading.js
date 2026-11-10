export default function StartupDashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 animate-pulse">
      {/* Welcome banner skeleton */}
      <div className="h-40 bg-slate-200 rounded-2xl" />

      {/* Metrics row skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-8 w-8 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-7 w-14 bg-slate-300 rounded" />
            <div className="h-2.5 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Charts row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-72 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-full bg-slate-100 rounded-xl" />
        </div>
        <div className="lg:col-span-5 h-72 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-40 w-40 bg-slate-100 rounded-full mx-auto mt-4" />
        </div>
      </div>

      {/* Meetings + Investors row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="h-9 w-9 bg-slate-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/4 bg-slate-200 rounded" />
                  <div className="h-2.5 w-1/2 bg-slate-100 rounded" />
                </div>
                <div className="h-6 w-16 bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

