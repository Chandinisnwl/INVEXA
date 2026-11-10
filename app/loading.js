export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-4">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Brand Vector Pulse */}
        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent to-violetAccent shadow-lg shadow-accent/25 animate-pulse">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
          >
            <path
              d="M4 16L10.5 9.5L14.5 13.5L20 8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 8H20V13"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold text-primary tracking-wide">INVEXA</h2>
          <p className="text-xs text-slate-400">Loading venture ecosystem...</p>
        </div>
      </div>
    </div>
  );
}

