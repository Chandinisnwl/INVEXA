'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Building,
  Save,
  Globe,
  DollarSign,
  Calendar,
  MapPin,
  CheckCircle2,
  Users,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function StartupProfilePage() {
  const [profile, setProfile] = useState({
    companyName: '',
    tagline: '',
    description: '',
    industry: 'AI / ML',
    stage: 'Early Stage',
    foundingYear: 2024,
    location: '',
    website: '',
    fundingRequired: 1500000,
    preferredInvestmentType: 'Equity',
    socialLinks: { twitter: '', linkedin: '', github: '' },
    teamMembers: [],
    completionPercentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newMember, setNewMember] = useState({ name: '', role: '' });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/startup/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile((prev) => ({
              ...prev,
              ...data.profile,
              socialLinks: { ...prev.socialLinks, ...(data.profile.socialLinks || {}) },
              teamMembers: data.profile.teamMembers || [],
            }));
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
      const res = await fetch('/api/startup/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setProfile(data.profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const addTeamMember = () => {
    if (!newMember.name || !newMember.role) return;
    setProfile({
      ...profile,
      teamMembers: [...profile.teamMembers, { ...newMember }],
    });
    setNewMember({ name: '', role: '' });
  };

  const removeTeamMember = (index) => {
    setProfile({
      ...profile,
      teamMembers: profile.teamMembers.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="startup" title="Startup Profile">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="startup" title="Manage Startup Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Completion Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-primary">Company Profile & Deal Details</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ensure all fields are accurate. Investors evaluate deal fit based on this data.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500">Profile Completion</span>
              <p className="text-lg font-extrabold text-accent">
                {profile.completionPercentage}%
              </p>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-xs text-accent">
              {profile.completionPercentage}%
            </div>
          </div>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-xl flex items-center gap-2 text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Core Information */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              1. Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Startup / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Founding Year
                </label>
                <input
                  type="number"
                  value={profile.foundingYear}
                  onChange={(e) =>
                    setProfile({ ...profile, foundingYear: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                One-Line Tagline *
              </label>
              <input
                type="text"
                placeholder="e.g. Distributed inference acceleration engine cutting LLM hosting compute costs"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Description & Problem Solved
              </label>
              <textarea
                rows={4}
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                placeholder="Describe your vision, product architecture, current customer traction, revenue model, and competitive edge..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
          </div>

          {/* Industry, Stage & Funding */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              2. Deal Economics & Stage
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Industry Sector
                </label>
                <select
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white"
                >
                  <option value="AI / ML">AI & Machine Learning</option>
                  <option value="FinTech">FinTech & Payments</option>
                  <option value="Enterprise SaaS">Enterprise SaaS</option>
                  <option value="HealthTech">HealthTech & Bio</option>
                  <option value="CleanTech">CleanTech & Energy</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Consumer Tech">Consumer Tech</option>
                  <option value="Robotics">Robotics & Hardware</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Startup Stage
                </label>
                <select
                  value={profile.stage}
                  onChange={(e) => setProfile({ ...profile, stage: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white"
                >
                  <option value="Idea">Idea / Concept</option>
                  <option value="MVP">MVP / Prototype</option>
                  <option value="Early Stage">Early Stage (Pre-Seed/Seed)</option>
                  <option value="Growth">Growth (Series A+)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location (City, State)
                </label>
                <input
                  type="text"
                  placeholder="San Francisco, CA"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Funding Amount ($ USD)
                </label>
                <input
                  type="number"
                  value={profile.fundingRequired}
                  onChange={(e) =>
                    setProfile({ ...profile, fundingRequired: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Preferred Investment Vehicle
                </label>
                <select
                  value={profile.preferredInvestmentType}
                  onChange={(e) =>
                    setProfile({ ...profile, preferredInvestmentType: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white"
                >
                  <option value="Equity">Priced Equity Round</option>
                  <option value="SAFE">SAFE (Post-money)</option>
                  <option value="Convertible Note">Convertible Note</option>
                  <option value="Grant">Grant / Non-Dilutive</option>
                  <option value="Debt">Venture Debt</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Website
              </label>
              <input
                type="url"
                placeholder="https://yourstartup.com"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
          </div>

          {/* Founding Team Members */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              3. Founding & Executive Team
            </h3>

            {profile.teamMembers.length > 0 && (
              <div className="space-y-2 mb-4">
                {profile.teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{member.name}</p>
                      <p className="text-[11px] text-slate-500">{member.role}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Founder / Executive Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="px-3.5 py-2 text-sm rounded-xl border border-slate-200"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Role (e.g. CEO & Co-founder)"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold shadow-md shadow-accent/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

