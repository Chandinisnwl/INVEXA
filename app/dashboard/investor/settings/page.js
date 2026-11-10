'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Settings, Shield, Bell, CheckCircle2 } from 'lucide-react';

export default function InvestorSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    pitchAlerts: true,
    calendarReminders: true,
    autoDeclineOutsideThesis: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout role="investor" title="Account Settings">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-violetAccent/10 text-violetAccent">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">Investor Dealflow Preferences</h2>
            <p className="text-xs text-slate-500">
              Configure communication alerts and session security.
            </p>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Preferences updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-violetAccent" />
              <span>Deal Inflow Notifications</span>
            </h3>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900">Instant Alert on Pitch Request</p>
                  <p className="text-[11px] text-slate-500">
                    Get pinged as soon as an eligible founder books an available calendar slot.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.pitchAlerts}
                  onChange={(e) => setPrefs({ ...prefs, pitchAlerts: e.target.checked })}
                  className="rounded text-violetAccent focus:ring-violetAccent"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900">Calendar Reminders (1 Hour Prior)</p>
                  <p className="text-[11px] text-slate-500">
                    Receive Google Meet video link reminder 60 minutes before scheduled call.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.calendarReminders}
                  onChange={(e) => setPrefs({ ...prefs, calendarReminders: e.target.checked })}
                  className="rounded text-violetAccent focus:ring-violetAccent"
                />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-violetAccent" />
              <span>Accreditation Verification & Security</span>
            </h3>
            <p className="text-xs text-slate-600">
              Your investor status is verified with SEC / international accredited investor status. All communications are confidential and encrypted.
            </p>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-violetAccent text-white font-bold text-xs hover:bg-violetAccent-hover shadow-sm transition-all"
          >
            Save Preferences
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

