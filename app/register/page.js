'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  Building,
  Briefcase,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'investor' ? 'investor' : 'startup';

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyOrFirmName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const qRole = searchParams.get('role');
    if (qRole === 'investor' || qRole === 'startup') {
      setRole(qRole);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push(data.redirectUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-2xl border border-slate-200/80">
      {/* Role Selection Toggle */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Select Your Role
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('startup')}
            className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-xs font-semibold ${
              role === 'startup'
                ? 'border-accent bg-accent/5 text-accent shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
            }`}
          >
            {role === 'startup' && (
              <CheckCircle2 className="w-4 h-4 text-accent absolute top-2 right-2" />
            )}
            <Building className="w-5 h-5 mb-1.5" />
            <span>Startup Founder</span>
            <span className="text-[10px] font-normal text-slate-500">Raise Capital</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('investor')}
            className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-xs font-semibold ${
              role === 'investor'
                ? 'border-violetAccent bg-violetAccent/5 text-violetAccent shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
            }`}
          >
            {role === 'investor' && (
              <CheckCircle2 className="w-4 h-4 text-violetAccent absolute top-2 right-2" />
            )}
            <Briefcase className="w-5 h-5 mb-1.5" />
            <span>Investor / VC</span>
            <span className="text-[10px] font-normal text-slate-500">Deploy Capital</span>
          </button>
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
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              placeholder="Alex Rivera"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="block w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {role === 'startup' ? 'Startup / Company Name' : 'Firm or Fund Name'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {role === 'startup' ? (
                <Building className="w-4 h-4" />
              ) : (
                <Briefcase className="w-4 h-4" />
              )}
            </div>
            <input
              type="text"
              required
              placeholder={
                role === 'startup' ? 'e.g. NeuralPulse AI' : 'e.g. Horizon Capital'
              }
              value={formData.companyOrFirmName}
              onChange={(e) =>
                setFormData({ ...formData, companyOrFirmName: e.target.value })
              }
              className="block w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-slate-800"
            />
          </div>
        </div>

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
              placeholder="name@organization.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="block w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="block w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-slate-800"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:translate-y-[-1px] disabled:opacity-50 mt-2 ${
            role === 'startup'
              ? 'bg-accent hover:bg-accent-hover shadow-accent/25'
              : 'bg-violetAccent hover:bg-violetAccent-hover shadow-violetAccent/25'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create {role === 'startup' ? 'Founder' : 'Investor'} Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link
          href="/login"
          className="font-bold text-accent hover:text-accent-hover hover:underline"
        >
          Log in to INVEXA
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-surface">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo className="justify-center mb-6" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Join the INVEXA Ecosystem
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Where Ambition Meets Investment. Choose your role to get started.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense
          fallback={
            <div className="bg-white p-8 rounded-2xl flex items-center justify-center min-h-[300px]">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
