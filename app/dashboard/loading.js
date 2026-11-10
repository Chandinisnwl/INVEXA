export default function DashboardLoading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse w-full">
      {/* Top Banner Skeleton */}
      <div className="h-44 bg-slate-200 rounded-3xl" />

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-7 w-16 bg-slate-300 rounded" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 h-80 bg-white rounded-2xl border border-slate-200 p-6" />
        <div className="lg:col-span-5 h-80 bg-white rounded-2xl border border-slate-200 p-6" />
      </div>
    </div>
  );
}

