export default function StartupsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-surface pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full animate-pulse">
        {/* Header Skeleton */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="h-6 w-32 bg-slate-200 rounded-full mx-auto" />
          <div className="h-10 w-96 bg-slate-200 rounded-2xl mx-auto" />
          <div className="h-4 w-80 bg-slate-200 rounded-lg mx-auto" />
        </div>

        {/* Filter bar skeleton */}
        <div className="h-28 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 w-20 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-12 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

