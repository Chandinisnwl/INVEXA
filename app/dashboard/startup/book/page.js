'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  ShieldCheck,
} from 'lucide-react';

function BookMeetingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedInvestorId = searchParams.get('investorId');

  const [investors, setInvestors] = useState([]);
  const [selectedInvestorId, setSelectedInvestorId] = useState(preselectedInvestorId || '');
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [availability, setAvailability] = useState(null);

  // Form states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Initialize available dates (Next 14 business days)
  const getNextDays = () => {
    const dates = [];
    const now = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      // Skip weekends (0 is Sunday, 6 is Saturday)
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dates.push({
          raw: d.toISOString().split('T')[0],
          dayOfWeek: d.getDay(),
          display: d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
        });
      }
    }
    return dates;
  };

  const availableDays = getNextDays();

  // Load all investors
  useEffect(() => {
    async function fetchInvestors() {
      try {
        const res = await fetch('/api/investors');
        if (res.ok) {
          const data = await res.json();
          setInvestors(data.investors || []);
          if (preselectedInvestorId) {
            const found = (data.investors || []).find(
              (i) => i.userId?._id === preselectedInvestorId || i._id === preselectedInvestorId
            );
            if (found) {
              setSelectedInvestor(found);
              setSelectedInvestorId(found.userId?._id || found.userId);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvestors();
  }, [preselectedInvestorId]);

  // When investor selection changes, fetch their availability schedule
  useEffect(() => {
    if (!selectedInvestorId) return;

    async function fetchAvailability() {
      try {
        const res = await fetch(`/api/investor/availability?investorId=${selectedInvestorId}`);
        if (res.ok) {
          const data = await res.json();
          setAvailability(data.availability);
        }
      } catch (err) {
        console.error(err);
      }
    }

    const current = investors.find(
      (i) => (i.userId?._id || i.userId) === selectedInvestorId
    );
    setSelectedInvestor(current || null);
    fetchAvailability();
  }, [selectedInvestorId, investors]);

  // Compute open slots for selected date based on investor schedule
  const getAvailableSlotsForDate = (dateStr) => {
    if (!dateStr || !availability?.weeklySchedule) {
      return [
        '10:00 AM - 10:30 AM',
        '11:30 AM - 12:00 PM',
        '02:00 PM - 02:30 PM',
        '03:30 PM - 04:00 PM',
      ];
    }

    const d = new Date(dateStr);
    const dayOfWeek = d.getDay(); // 1 = Mon ...
    const daySchedule = availability.weeklySchedule.find((s) => s.dayOfWeek === dayOfWeek);

    if (daySchedule && daySchedule.slots && daySchedule.slots.length > 0) {
      return daySchedule.slots.map((s) => `${s.startTime} - ${s.endTime}`);
    }

    return [
      '10:00 AM - 10:30 AM',
      '02:00 PM - 02:30 PM',
      '04:00 PM - 04:30 PM',
    ];
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (!selectedInvestorId) throw new Error('Please select an investor to pitch.');
      if (!selectedDate) throw new Error('Please choose a date from the calendar.');
      if (!selectedSlot) throw new Error('Please select an available time slot.');
      if (!title) throw new Error('Please enter a meeting title.');

      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorId: selectedInvestorId,
          date: selectedDate,
          timeSlot: selectedSlot,
          title,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to request meeting');

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/startup/meetings');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-accent/10 text-accent">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">Direct Partner Pitch Scheduler</h2>
            <p className="text-xs text-slate-500">
              Pick an investor, choose an open calendar slot, and submit your pitch agenda.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
          30-Min High-Signal Slots
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Pitch meeting request successfully submitted! Redirecting to your meetings...</span>
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-6">
        {/* STEP 1: SELECT INVESTOR */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Step 1: Choose Investor or Syndicate
            </h3>
            {selectedInvestor && (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Allocator
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Target Investor
            </label>
            <select
              value={selectedInvestorId}
              onChange={(e) => setSelectedInvestorId(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white"
            >
              <option value="">-- Select from accredited investors --</option>
              {investors.map((inv) => (
                <option
                  key={inv._id}
                  value={inv.userId?._id || inv.userId}
                >
                  {inv.fullName} — {inv.firmName} ({formatCurrency(inv.minInvestment)} - {formatCurrency(inv.maxInvestment)})
                </option>
              ))}
            </select>
          </div>

          {selectedInvestor && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedInvestor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt={selectedInvestor.fullName}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-primary">{selectedInvestor.fullName}</h4>
                  <p className="text-xs text-slate-500">
                    {selectedInvestor.title} • {selectedInvestor.firmName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedInvestor.location}</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Target Ticket</span>
                <p className="text-sm font-extrabold text-accent">
                  {formatCurrency(selectedInvestor.minInvestment)} - {formatCurrency(selectedInvestor.maxInvestment)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* STEP 2: SELECT DATE & TIME SLOT */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            Step 2: Select Date & Available Time Slot
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Available Calendar Dates
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {availableDays.map((d) => {
                const isSelected = selectedDate === d.raw;
                return (
                  <button
                    type="button"
                    key={d.raw}
                    onClick={() => {
                      setSelectedDate(d.raw);
                      setSelectedSlot('');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all text-xs font-medium ${
                      isSelected
                        ? 'border-accent bg-accent text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <p className={`text-[10px] uppercase font-bold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      {d.display.split(',')[0]}
                    </p>
                    <p className="font-extrabold text-xs mt-0.5">
                      {d.display.split(',')[1]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="pt-2 animate-fadeIn">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Time Slot for {formatDate(selectedDate)}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {getAvailableSlotsForDate(selectedDate).map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-center transition-all text-xs font-semibold flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'border-accent bg-accent text-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-accent'}`} />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* STEP 3: MEETING AGENDA DETAILS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            Step 3: Pitch Agenda & Meeting Description
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Meeting Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Seed Pitch & Demo: NeuralPulse AI Inference Acceleration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Pitch Context & Specific Discussion Topics
            </label>
            <textarea
              rows={3}
              placeholder="Give the partner context on your current MRR/traction, live pilot accounts, why their fund thesis matches your round, and what you will demo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            Your attached pitch deck will be automatically shared with the investor upon booking.
          </p>
          <button
            type="submit"
            disabled={submitting || !selectedInvestorId || !selectedDate || !selectedSlot}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold shadow-lg shadow-accent/25 transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Pitch Request...</span>
              </>
            ) : (
              <>
                <span>Request Pitch Meeting</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function BookMeetingPage() {
  return (
    <DashboardLayout role="startup" title="Schedule Partner Pitch">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        }
      >
        <BookMeetingForm />
      </Suspense>
    </DashboardLayout>
  );
}
