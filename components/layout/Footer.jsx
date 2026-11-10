import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-primary text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo light={true} />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mt-2">
              Where Ambition Meets Investment. The modern venture network connecting high-growth startups with visionary investors through structured discovery, verified pitch decks, and seamless calendar booking.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <span className="text-xs bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60 font-medium">
                Next-Gen Venture SaaS
              </span>
              <span className="text-xs bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60 font-medium text-emerald-400">
                ● 100% Verified
              </span>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/investors" className="hover:text-accent transition-colors">
                  Explore Investors
                </Link>
              </li>
              <li>
                <Link href="/startups" className="hover:text-accent transition-colors">
                  Explore Startups
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-accent transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#featured" className="hover:text-accent transition-colors">
                  Featured Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register?role=startup" className="hover:text-accent transition-colors">
                  For Startups
                </Link>
              </li>
              <li>
                <Link href="/register?role=investor" className="hover:text-accent transition-colors">
                  For Angel Investors
                </Link>
              </li>
              <li>
                <Link href="/register?role=investor" className="hover:text-accent transition-colors">
                  For Venture Capital
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-accent transition-colors">
                  Pitch Room Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  About INVEXA
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  Security & Encryption
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} INVEXA Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Official Brand: <span className="font-semibold text-white">INVEXA</span> — Where Ambition Meets Investment.
          </p>
        </div>
      </div>
    </footer>
  );
}

