'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatDate, STATUS_COLORS } from '@/lib/utils';
import {
  Clock,
  Check,
  X,
  FileText,
  Calendar,
  ExternalLink,
  AlertCircle,
  Loader2,
  Building,
} from 'lucide-react';

export default function InvestorPitchRequestsPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  const handleDecision = async (meetingId, decision) => {
    setActionLoading(meetingId);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/meetings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId, status: decision }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update meeting');

      setMessage({
        type: 'success',
        text: `Pitch request has been ${decision.toLowerCase()}!`,
      });
      await fetchMeetings();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const pendingRequests = meetings.filter((m) => m.status === 'Pending');
  const pastDecisions = meetings.filter((m) => m.status !== 'Pending');

  return (
    <DashboardLayout role="investor" title="Pitch Requests">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violetAccent/10 text-violetAccent">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Incoming Pitch Requests</h2>
              <p className="text-xs text-slate-500">
                Review startup applications, inspect pitch decks, and accept or decline meetings.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
            {pendingRequests.length} Pending Actions
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

        {/* PENDING SECTION */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
            Awaiting Your Decision ({pendingRequests.length})
          </h3>

          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader2 className="w-8 h-8 animate-spin text-violetAccent" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-slate-500">
              No pending pitch requests. Your inbox is clear!
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((m) => (
                <div
                  key={m._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary bg-slate-100 px-2.5 py-1 rounded-lg">
                        {m.startupId?.name}
                      </span>
                      {m.otherProfile?.companyName && (
                        <span className="text-xs font-extrabold text-violetAccent">
                          • {m.otherProfile.companyName}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-400">
                        ({m.otherProfile?.stage || 'Early Stage'})
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-primary">{m.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {m.description || 'No pitch description provided.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        {formatDate(m.date)} at {m.timeSlot}
                      </span>
                      {m.otherProfile?.industry && (
                        <span>Industry: {m.otherProfile.industry}</span>
                      )}
                      {m.otherProfile?.fundingRequired && (
                        <span>
                          Target: ${(m.otherProfile.fundingRequired / 1000).toFixed(0)}K
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Pitch Deck Link */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 flex-shrink-0">
                    {m.pitchDeckUrl ? (
                      <a
                        href={m.pitchDeckUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-accent hover:border-accent transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Review Deck</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No deck attached</span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecision(m._id, 'Accepted')}
                        disabled={actionLoading === m._id}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Slot</span>
                      </button>

                      <button
                        onClick={() => handleDecision(m._id, 'Rejected')}
                        disabled={actionLoading === m._id}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-all disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DECISION HISTORY */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
            Previous Decisions & History
          </h3>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {pastDecisions.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400">No past decisions yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {pastDecisions.map((m) => {
                  const style = STATUS_COLORS[m.status] || STATUS_COLORS.Completed;
                  return (
                    <div
                      key={m._id}
                      className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{m.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.bg}`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-slate-500">
                          {m.startupId?.name} ({m.otherProfile?.companyName || 'Startup'}) • {formatDate(m.date)} {m.timeSlot}
                        </p>
                      </div>

                      {m.status === 'Accepted' && (
                        <a
                          href={m.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-emerald-600 hover:underline"
                        >
                          Join Call →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

