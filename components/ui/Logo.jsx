import Link from 'next/link';

export default function Logo({ className = '', iconOnly = false, light = false }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Distinctive modern geometric icon: Chevron-up investment vector intersecting hexagonal nodes */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-violetAccent shadow-md shadow-accent/20 group-hover:scale-105 transition-transform duration-200">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          {/* Growth vector mark */}
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
          <circle cx="4" cy="16" r="1.5" fill="currentColor" />
          <circle cx="10.5" cy="9.5" r="1.5" fill="currentColor" />
          <circle cx="14.5" cy="13.5" r="1.5" fill="currentColor" />
          <circle cx="20" cy="8" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span
              className={`font-black tracking-wider text-xl font-sans ${
                light ? 'text-white' : 'text-primary'
              }`}
            >
              INVEXA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <span
            className={`text-[9px] uppercase tracking-widest font-semibold ${
              light ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Venture Platform
          </span>
        </div>
      )}
    </Link>
  );
}

