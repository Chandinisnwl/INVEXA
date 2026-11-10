'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Clock, Plus, Trash2, CheckCircle2, AlertCircle, Loader2, Save } from 'lucide-react';

export default function InvestorAvailabilityPage() {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function fetchAvail() {
      try {
        const res = await fetch('/api/investor/availability');
        if (res.ok) {
          const data = await res.json();
          setAvailability(data.availability);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAvail();
  }, []);

  const handleToggleDay = (dayIndex) => {
    const updated = { ...availability };
    updated.weeklySchedule[dayIndex].isAvailable = !updated.weeklySchedule[dayIndex].isAvailable;
    setAvailability(updated);
  };

  const addSlot = (dayIndex) => {
    const updated = { ...availability };
    updated.weeklySchedule[dayIndex].slots.push({
      startTime: '02:00 PM',
      endTime: '02:30 PM',
    });
    setAvailability(updated);
  };

  const removeSlot = (dayIndex, slotIndex) => {
    const updated = { ...availability };
    updated.weeklySchedule[dayIndex].slots = updated.weeklySchedule[dayIndex].slots.filter(
      (_, i) => i !== slotIndex
    );
    setAvailability(updated);
  };

  const handleSlotChange = (dayIndex, slotIndex, field, value) => {
    const updated = { ...availability };
    updated.weeklySchedule[dayIndex].slots[slotIndex][field] = value;
    setAvailability(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/investor/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(availability),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update schedule');

      setMessage({ type: 'success', text: 'Calendar availability schedule saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="investor" title="Availability Settings">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-violetAccent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="investor" title="Manage Partner Availability">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violetAccent/10 text-violetAccent">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Pitch Booking Availability Rules</h2>
              <p className="text-xs text-slate-500">
                Define the recurring weekly slots startups can reserve for live pitch presentations.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            Auto-Conflict Prevention Active
          </span>
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              Weekly Recurring Availability
            </h3>

            <div className="divide-y divide-slate-100">
              {availability?.weeklySchedule?.map((day, dayIdx) => (
                <div key={day.dayOfWeek} className="py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={day.isAvailable}
                        onChange={() => handleToggleDay(dayIdx)}
                        className="rounded text-violetAccent focus:ring-violetAccent w-4 h-4"
                      />
                      <span className="text-sm font-bold text-slate-800">{day.dayName}</span>
                    </div>

                    {day.isAvailable && (
                      <button
                        type="button"
                        onClick={() => addSlot(dayIdx)}
                        className="text-xs font-semibold text-violetAccent hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Slot</span>
                      </button>
                    )}
                  </div>

                  {day.isAvailable && (
                    <div className="pl-7 space-y-2">
                      {day.slots.map((slot, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 text-xs">
                          <input
                            type="text"
                            value={slot.startTime}
                            onChange={(e) =>
                              handleSlotChange(dayIdx, sIdx, 'startTime', e.target.value)
                            }
                            placeholder="10:00 AM"
                            className="px-3 py-1.5 rounded-lg border border-slate-200 w-28 text-center"
                          />
                          <span className="text-slate-400">to</span>
                          <input
                            type="text"
                            value={slot.endTime}
                            onChange={(e) =>
                              handleSlotChange(dayIdx, sIdx, 'endTime', e.target.value)
                            }
                            placeholder="10:30 AM"
                            className="px-3 py-1.5 rounded-lg border border-slate-200 w-28 text-center"
                          />
                          <button
                            type="button"
                            onClick={() => removeSlot(dayIdx, sIdx)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
                  <span>Save Availability</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

