'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatDate, STATUS_COLORS } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Video,
  XCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Plus,
  Loader2,
} from 'lucide-react';

export default function StartupMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchMeetings = async () => {
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
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCancel = async (meetingId) => {
    if (!confirm('Are you sure you want to cancel this meeting?')) return;
    setActionLoading(meetingId);
    try {
      const res = await fetch('/api/meetings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId, status: 'Cancelled' }),
      });
      if (res.ok) {
        await fetchMeetings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const statuses = ['All', 'Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'];

  const filteredMeetings =
    filterStatus === 'All'
      ? meetings
      : meetings.filter((m) => m.status === filterStatus);

  return (
    <DashboardLayout role="startup" title="My Pitch Meetings">
      <div className="space-y-6">
        {/* Header with quick CTA */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-primary">Pitch Meeting Calendar & Requests</h2>
            <p className="text-xs text-slate-500">
              Track status, join video conferences, and schedule new meetings with investors.
            </p>
          </div>
          <Link
            href="/dashboard/startup/book"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Pitch</span>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st} {st !== 'All' && `(${meetings.filter((m) => m.status === st).length})`}
            </button>
          ))}
        </div>

        {/* Meetings List */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-primary">No meetings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} meetings in your record.
            </p>
            <Link
              href="/dashboard/startup/book"
              className="inline-block mt-2 px-4 py-2 text-xs font-semibold text-white bg-accent rounded-xl"
            >
              Schedule a Pitch
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMeetings.map((m) => {
              const statusStyle = STATUS_COLORS[m.status] || STATUS_COLORS.Pending;
              return (
                <div
                  key={m._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusStyle.bg}`}
                      >
                        {m.status}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>{formatDate(m.date)}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-primary">{m.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                        {m.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            m.otherProfile?.avatarUrl ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                          }
                          alt={m.investorId?.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{m.investorId?.name || 'Investor'}</p>
                          <p className="text-[11px] text-slate-500">
                            {m.otherProfile?.firmName || 'Venture Partner'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-slate-700 font-semibold">
                          <Clock className="w-3 h-3 text-accent" />
                          <span>{m.timeSlot}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">30 min slot</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    {m.status === 'Accepted' ? (
                      <a
                        href={m.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Video Call</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {m.status === 'Pending'
                          ? 'Awaiting investor acceptance'
                          : `Status: ${m.status}`}
                      </span>
                    )}

                    {['Pending', 'Accepted'].includes(m.status) && (
                      <button
                        onClick={() => handleCancel(m._id)}
                        disabled={actionLoading === m._id}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

