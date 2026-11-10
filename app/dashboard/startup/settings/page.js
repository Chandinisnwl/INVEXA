'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Settings, Shield, Bell, Lock, CheckCircle2 } from 'lucide-react';

export default function StartupSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    emailNotifs: true,
    deckViews: true,
    calendarSync: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout role="startup" title="Account Settings">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-accent/10 text-accent">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">Founder Preferences & Security</h2>
            <p className="text-xs text-slate-500">
              Configure communication alerts and session security.
            </p>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900">Email Alerts on Meeting Confirmation</p>
                  <p className="text-[11px] text-slate-500">
                    Receive an immediate email alert when an investor accepts your pitch.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.emailNotifs}
                  onChange={(e) => setPrefs({ ...prefs, emailNotifs: e.target.checked })}
                  className="rounded text-accent focus:ring-accent"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900">Pitch Deck View Telemetry</p>
                  <p className="text-[11px] text-slate-500">
                    Notify when an investor opens your uploaded slide deck.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.deckViews}
                  onChange={(e) => setPrefs({ ...prefs, deckViews: e.target.checked })}
                  className="rounded text-accent focus:ring-accent"
                />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>Security & Encryption</span>
            </h3>
            <p className="text-xs text-slate-600">
              Your session is encrypted with JSON Web Tokens (JWT) and passwords are saved using bcrypt salt rounds.
            </p>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent-hover shadow-sm transition-all"
          >
            Save Preferences
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

