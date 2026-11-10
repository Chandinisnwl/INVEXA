'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatDate, STATUS_COLORS } from '@/lib/utils';
import { Calendar, Clock, Video, FileText, CheckCircle2 } from 'lucide-react';

export default function InvestorMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const res = await fetch('/api/meetings');
        if (res.ok) {
          const data = await res.json();
          setMeetings(data.meetings || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMeetings();
  }, []);

  const filtered = filter === 'All' ? meetings : meetings.filter((m) => m.status === filter);

  return (
    <DashboardLayout role="investor" title="Scheduled Pitch Sessions">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-primary">All Pitch Sessions</h2>
            <p className="text-xs text-slate-500">
              Manage live Google Meet pitch calls and track meetings history.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-violetAccent/10 text-violetAccent rounded-full">
            {meetings.length} Total Sessions
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Accepted', 'Pending', 'Completed', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === status
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-2 bg-white rounded-2xl p-10 text-center text-xs text-slate-400 border border-slate-200">
              No meetings found for this filter.
            </div>
          ) : (
            filtered.map((m) => {
              const style = STATUS_COLORS[m.status] || STATUS_COLORS.Pending;
              return (
                <div
                  key={m._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.bg}`}>
                        {m.status}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {formatDate(m.date)} • {m.timeSlot}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-primary">{m.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {m.description || 'Pitch presentation'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{m.startupId?.name}</p>
                        <p className="text-[11px] text-slate-500">{m.otherProfile?.companyName}</p>
                      </div>
                      {m.pitchDeckUrl && (
                        <a
                          href={m.pitchDeckUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-violetAccent hover:underline"
                        >
                          View Deck →
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    {m.status === 'Accepted' && (
                      <a
                        href={m.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Meeting</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

