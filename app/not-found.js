import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { Compass, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-surface">
      <div className="py-6 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <Logo />
      </div>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto text-accent">
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-4xl font-black text-slate-300 font-mono">404</span>
            <h1 className="text-2xl font-extrabold text-primary">Page Not Found</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              The startup, investor profile, or venture resource you are looking for does not exist or has been relocated.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-slate-800 text-white text-xs font-bold transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/investors"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-md shadow-accent/20 transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} INVEXA — Where Ambition Meets Investment.
      </footer>
    </div>
  );
}

