'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { PitchRequestBarChart, MeetingVelocityLineChart } from '@/components/charts/DashboardCharts';
import { formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils';
import {
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Video,
  ChevronRight,
  Briefcase,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function InvestorDashboardOverview() {
  const [profile, setProfile] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [startups, setStartups] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvestorDashboard() {
      try {
        const [profRes, meetRes, startRes, analRes] = await Promise.all([
          fetch('/api/investor/profile'),
          fetch('/api/meetings'),
          fetch('/api/startups'),
          fetch('/api/analytics'),
        ]);

        if (profRes.ok) {
          const profData = await profRes.json();
          setProfile(profData.profile);
        }
        if (meetRes.ok) {
          const meetData = await meetRes.json();
          setMeetings(meetData.meetings || []);
        }
        if (startRes.ok) {
          const startData = await startRes.json();
          setStartups((startData.startups || []).slice(0, 3));
        }
        if (analRes.ok) {
          const analData = await analRes.json();
          setAnalytics(analData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInvestorDashboard();
  }, []);

  const totalRequests = analytics?.stats?.totalRequests || meetings.length;
  const pendingRequests =
    analytics?.stats?.pendingRequests ||
    meetings.filter((m) => m.status === 'Pending').length;
  const acceptedRequests =
    analytics?.stats?.acceptedRequests ||
    meetings.filter((m) => m.status === 'Accepted').length;
  const upcomingMeetings = meetings.filter((m) => m.status === 'Accepted');

  const pendingList = meetings.filter((m) => m.status === 'Pending');

  return (
    <DashboardLayout role="investor" title="Investor Dashboard">
      <div className="space-y-8">
        {/* WELCOME BANNER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-slate-900 to-primary text-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violetAccent/20 text-violetAccent text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Investor & Partner Suite</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {profile?.fullName || 'Investor'}!
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                {profile?.firmName ? `${profile.firmName} Dealflow Pipeline` : 'Active Venture Allocation'} — Review incoming founder decks, manage your meeting calendar, and filter qualified deals.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[240px] border border-white/10 text-xs space-y-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
                Thesis Check Size
              </span>
              <p className="text-lg font-extrabold text-violetAccent">
                {formatCurrency(profile?.minInvestment || 100000)} - {formatCurrency(profile?.maxInvestment || 1500000)}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(profile?.industries || ['AI', 'SaaS', 'FinTech']).slice(0, 3).map((ind, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/15 text-slate-200 font-semibold"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Pitch Requests
              </p>
              <h3 className="text-2xl font-black text-primary mt-1">{totalRequests}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Founders awaiting response</p>
            </div>
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pending Pitch Requests
              </p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingRequests}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Requires your decision</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Accepted Requests
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{acceptedRequests}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Confirmed pitch dates</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Upcoming Meetings
              </p>
              <h3 className="text-2xl font-black text-violetAccent mt-1">{upcomingMeetings.length}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">On your partner calendar</p>
            </div>
            <div className="p-3 rounded-xl bg-violetAccent/10 text-violetAccent">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* PENDING REQUESTS REQUIRING ATTENTION */}
        {pendingList.length > 0 && (
          <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-900">
                  New Pitch Requests Awaiting Your Review ({pendingList.length})
                </h3>
              </div>
              <Link
                href="/dashboard/investor/requests"
                className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>Manage all requests</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingList.slice(0, 2).map((m) => (
                <div
                  key={m._id}
                  className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-primary">{m.title}</span>
                      <span className="text-slate-500 font-semibold">{m.timeSlot}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {m.description || 'Startup submitted a pitch session request.'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Founder: <span className="font-semibold text-slate-800">{m.startupId?.name}</span> ({formatDate(m.date)})
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                    <Link
                      href="/dashboard/investor/requests"
                      className="text-xs font-bold text-accent hover:underline"
                    >
                      Review & Decide →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHARTS & RECENT STARTUPS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primary">Monthly Dealflow Volume</h3>
                <p className="text-xs text-slate-500">Pitch submissions vs. accepted allocations</p>
              </div>
              <span className="text-[11px] font-semibold text-violetAccent bg-violetAccent/10 px-2.5 py-1 rounded-full">
                Active Funnel
              </span>
            </div>
            <PitchRequestBarChart data={analytics?.charts?.monthlyRequests} />
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-primary">Recommended Startups</h3>
                <Link
                  href="/startups"
                  className="text-xs font-semibold text-violetAccent hover:underline"
                >
                  Explore all
                </Link>
              </div>

              <div className="space-y-3">
                {startups.map((s) => (
                  <div
                    key={s._id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-surface hover:border-slate-300 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-primary">{s.companyName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {s.industry} • <span className="text-emerald-600 font-semibold">{s.stage}</span>
                      </p>
                      <p className="text-[11px] font-extrabold text-slate-800 mt-0.5">
                        Raising {formatCurrency(s.fundingRequired)}
                      </p>
                    </div>

                    <Link
                      href={`/startups?id=${s._id}`}
                      className="px-3 py-1.5 rounded-lg bg-primary hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                    >
                      View Deck
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 text-center">
              <Link
                href="/dashboard/investor/availability"
                className="text-xs font-bold text-violetAccent hover:underline inline-flex items-center gap-1"
              >
                <span>Configure your calendar availability slots</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

