'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { PitchRequestBarChart, IndustryPieChart } from '@/components/charts/DashboardCharts';
import { formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils';
import {
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  FileText,
  UserCheck,
  Video,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function StartupDashboardOverview() {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [recommendedInvestors, setRecommendedInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [profRes, meetRes, invRes, analRes] = await Promise.all([
          fetch('/api/startup/profile'),
          fetch('/api/meetings'),
          fetch('/api/investors'),
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
        if (invRes.ok) {
          const invData = await invRes.json();
          setRecommendedInvestors((invData.investors || []).slice(0, 3));
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
    loadDashboard();
  }, []);

  const totalRequests = analytics?.stats?.totalRequests || meetings.length;
  const pendingRequests =
    analytics?.stats?.pendingRequests ||
    meetings.filter((m) => m.status === 'Pending').length;
  const acceptedMeetings =
    analytics?.stats?.acceptedRequests ||
    meetings.filter((m) => m.status === 'Accepted').length;
  const upcomingMeetingsList = meetings.filter(
    (m) => m.status === 'Accepted' || m.status === 'Pending'
  );

  const completionPct = profile?.completionPercentage || 65;

  return (
    <DashboardLayout role="startup" title="Startup Dashboard">
      <div className="space-y-8">
        {/* WELCOME BANNER & PROFILE COMPLETION */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Founder Command Center</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {profile?.companyName || 'Founder'}!
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                {profile?.tagline ||
                  'Your deal pipeline is active. Manage your pitch materials, track responses, and book partner meetings.'}
              </p>
            </div>

            {/* Profile completion gauge */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[240px] border border-white/10">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-200">Profile Readiness</span>
                <span className="font-bold text-accent">{completionPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500 rounded-full"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-[11px]">
                <span className="text-slate-300">
                  {completionPct < 80 ? 'Complete profile for 3x reach' : 'Profile highly optimized'}
                </span>
                <Link
                  href="/dashboard/startup/profile"
                  className="font-bold text-accent hover:underline"
                >
                  Edit →
                </Link>
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
              <p className="text-[11px] text-slate-400 mt-0.5">Across all registered funds</p>
            </div>
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pending Requests
              </p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingRequests}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Awaiting partner review</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Accepted Meetings
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{acceptedMeetings}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Confirmed pitch dates</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Fundraising Target
              </p>
              <h3 className="text-2xl font-black text-primary mt-1">
                {formatCurrency(profile?.fundingRequired || 1500000)}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {profile?.preferredInvestmentType || 'Equity'} Round
              </p>
            </div>
            <div className="p-3 rounded-xl bg-violetAccent/10 text-violetAccent">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/investors"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-accent hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Discover Active Investors</p>
                <p className="text-[11px] text-slate-500">Filter by check size and thesis</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent transition-colors" />
          </Link>

          <Link
            href="/dashboard/startup/pitch-deck"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-accent hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-violetAccent/10 text-violetAccent group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Manage Pitch Deck</p>
                <p className="text-[11px] text-slate-500">Upload & preview investor slide deck</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent transition-colors" />
          </Link>

          <Link
            href="/dashboard/startup/book"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-accent hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Schedule New Pitch</p>
                <p className="text-[11px] text-slate-500">Pick an open partner slot</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent transition-colors" />
          </Link>
        </div>

        {/* CHARTS & RECENT ACTIVITY DUAL COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Recharts analytics */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primary">Pitch Request Activity</h3>
                <p className="text-xs text-slate-500">Monthly submissions vs. accepted partner pitches</p>
              </div>
              <span className="text-[11px] font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                2026 Season
              </span>
            </div>
            <PitchRequestBarChart data={analytics?.charts?.monthlyRequests} />
          </div>

          {/* Right: Upcoming meeting schedule */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-primary">Upcoming Pitch Schedule</h3>
                <Link
                  href="/dashboard/startup/meetings"
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  View all
                </Link>
              </div>

              {upcomingMeetingsList.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">No scheduled pitch meetings yet</p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Search investors and submit a pitch booking to lock in your next investor call.
                  </p>
                  <Link
                    href="/investors"
                    className="inline-block mt-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-accent rounded-lg"
                  >
                    Browse Investors
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingMeetingsList.slice(0, 3).map((m) => {
                    const statusStyle =
                      STATUS_COLORS[m.status] || STATUS_COLORS.Pending;
                    return (
                      <div
                        key={m._id}
                        className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle.bg}`}
                          >
                            {m.status}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">
                            {formatDate(m.date)} • {m.timeSlot}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800">{m.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          With: <span className="font-semibold">{m.investorId?.name || 'Investor'}</span>{' '}
                          {m.otherProfile?.firmName && `(${m.otherProfile.firmName})`}
                        </p>
                        {m.status === 'Accepted' && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <Video className="w-3.5 h-3.5" /> Video Conference Ready
                            </span>
                            <a
                              href={m.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent font-bold hover:underline"
                            >
                              Join Call →
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 text-center">
              <Link
                href="/dashboard/startup/book"
                className="text-xs font-bold text-accent hover:underline inline-flex items-center gap-1"
              >
                <span>Request another partner meeting</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* RECOMMENDED INVESTORS SECTION */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-primary">Recommended Investors For You</h3>
              <p className="text-xs text-slate-500">
                Matched according to your stage ({profile?.stage || 'Early Stage'}) and industry ({profile?.industry || 'Tech'})
              </p>
            </div>
            <Link
              href="/investors"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>Explore full directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedInvestors.map((inv) => (
              <div
                key={inv._id}
                className="p-4 rounded-xl border border-slate-200 bg-surface hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={inv.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                      alt={inv.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-primary">{inv.fullName}</h4>
                      <p className="text-[11px] text-slate-500">{inv.firmName}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{inv.bio}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Check Size</span>
                    <p className="font-extrabold text-primary">
                      {formatCurrency(inv.minInvestment)} - {formatCurrency(inv.maxInvestment)}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/startup/book?investorId=${inv.userId?._id || inv.userId}`}
                    className="px-3 py-1.5 rounded-lg bg-accent text-white font-semibold text-[11px] hover:bg-accent-hover transition-colors"
                  >
                    Book Pitch
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

