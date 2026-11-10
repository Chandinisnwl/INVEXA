'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Briefcase, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function InvestorProfilePage() {
  const [profile, setProfile] = useState({
    fullName: '',
    firmName: '',
    title: '',
    bio: '',
    industries: ['AI / ML', 'Enterprise SaaS'],
    minInvestment: 50000,
    maxInvestment: 1000000,
    preferredStages: ['Seed', 'Early Stage'],
    location: '',
    website: '',
    linkedinUrl: '',
    completionPercentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/investor/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile((prev) => ({ ...prev, ...data.profile }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/investor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setProfile(data.profile);
      setMessage({ type: 'success', text: 'Investor profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleIndustryToggle = (ind) => {
    if (profile.industries.includes(ind)) {
      setProfile({
        ...profile,
        industries: profile.industries.filter((i) => i !== ind),
      });
    } else {
      setProfile({ ...profile, industries: [...profile.industries, ind] });
    }
  };

  const industryOptions = [
    'AI / ML',
    'Enterprise SaaS',
    'FinTech',
    'HealthTech',
    'Cybersecurity',
    'CleanTech',
    'Consumer Tech',
    'Web3',
  ];

  if (loading) {
    return (
      <DashboardLayout role="investor" title="Investor Profile">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-violetAccent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="investor" title="Manage Investor Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violetAccent/10 text-violetAccent">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Investor & Fund Credentials</h2>
              <p className="text-xs text-slate-500">
                Founders discover your syndicate and request pitch slots based on these parameters.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500">Profile Readiness</span>
            <p className="text-lg font-extrabold text-violetAccent">
              {profile.completionPercentage}%
            </p>
          </div>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              Identity & Firm
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violetAccent/20 focus:border-violetAccent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Firm or Syndicate Name
                </label>
                <input
                  type="text"
                  value={profile.firmName}
                  onChange={(e) => setProfile({ ...profile, firmName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violetAccent/20 focus:border-violetAccent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Title (e.g. General Partner, Lead Angel)
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violetAccent/20 focus:border-violetAccent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location (City, State)
                </label>
                <input
                  type="text"
                  placeholder="New York, NY"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violetAccent/20 focus:border-violetAccent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Investor Biography & Investment Thesis
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Share your background, previous fund returns or portfolio highlights, and what you look for in prospective founders..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violetAccent/20 focus:border-violetAccent"
              />
            </div>
          </div>

          {/* Allocation Ticket Range */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              Check Sizes & Industry Focus
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Minimum Check Size ($ USD)
                </label>
                <input
                  type="number"
                  value={profile.minInvestment}
                  onChange={(e) =>
                    setProfile({ ...profile, minInvestment: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violetAccent/20 focus:border-violetAccent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Maximum Check Size ($ USD)
                </label>
                <input
                  type="number"
                  value={profile.maxInvestment}
                  onChange={(e) =>
                    setProfile({ ...profile, maxInvestment: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violetAccent/20 focus:border-violetAccent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Sectors of Interest
              </label>
              <div className="flex flex-wrap gap-2">
                {industryOptions.map((ind) => {
                  const isSelected = profile.industries.includes(ind);
                  return (
                    <button
                      type="button"
                      key={ind}
                      onClick={() => handleIndustryToggle(ind)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-violetAccent text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {ind} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-violetAccent hover:bg-violetAccent-hover text-white text-sm font-bold shadow-md shadow-violetAccent/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Investor Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

