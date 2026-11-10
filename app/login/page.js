'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { ArrowRight, Lock, Mail, Sparkles, Building, Briefcase, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      router.push(data.redirectUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setDemoLoading(role);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoRole: role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in with demo');
      }

      router.push(data.redirectUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-surface">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo className="justify-center mb-6" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Welcome back to INVEXA
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Where Ambition Meets Investment. Sign in to your venture portal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-2xl border border-slate-200/80">
          {/* Quick Demo Sign In Cards */}
          <div className="mb-6 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Instant Demo Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('startup')}
                disabled={Boolean(demoLoading) || loading}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-accent/5 hover:border-accent/40 text-slate-700 hover:text-accent transition-all text-xs font-semibold group disabled:opacity-50"
              >
                {demoLoading === 'startup' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-accent mb-1" />
                ) : (
                  <Building className="w-4 h-4 text-accent mb-1 group-hover:scale-110 transition-transform" />
                )}
                <span>Demo Startup</span>
                <span className="text-[10px] font-normal text-slate-500">Alex (Founder)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('investor')}
                disabled={Boolean(demoLoading) || loading}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-violetAccent/5 hover:border-violetAccent/40 text-slate-700 hover:text-violetAccent transition-all text-xs font-semibold group disabled:opacity-50"
              >
                {demoLoading === 'investor' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-violetAccent mb-1" />
                ) : (
                  <Briefcase className="w-4 h-4 text-violetAccent mb-1 group-hover:scale-110 transition-transform" />
                )}
                <span>Demo Investor</span>
                <span className="text-[10px] font-normal text-slate-500">Marcus (VC Partner)</span>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Or sign in with email
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="founder@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(demoLoading)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-hover shadow-md shadow-accent/25 transition-all hover:translate-y-[-1px] disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link
              href="/register"
              className="font-bold text-accent hover:text-accent-hover hover:underline"
            >
              Create INVEXA Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

