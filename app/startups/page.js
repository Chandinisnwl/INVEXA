'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  Filter,
  Building,
  MapPin,
  DollarSign,
  FileText,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';

export default function StartupDiscoveryPage() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [activeStartup, setActiveStartup] = useState(null);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (selectedIndustry !== 'All') params.append('industry', selectedIndustry);
      if (selectedStage !== 'All') params.append('stage', selectedStage);

      const res = await fetch(`/api/startups?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStartups(data.startups || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [selectedIndustry, selectedStage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStartups();
  };

  const industries = ['All', 'AI / ML', 'FinTech', 'HealthTech', 'Enterprise SaaS', 'Cybersecurity', 'CleanTech'];
  const stages = ['All', 'Idea', 'MVP', 'Early Stage', 'Growth'];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
            <span className="text-xs font-bold tracking-wider text-accent uppercase bg-accent/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Venture Dealflow Directory</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight">
              Explore High-Traction Startups
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Discover verified founders raising active Seed and Series A rounds with audited pitch decks and direct meeting access.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by startup name, value proposition, or sector..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-500 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Sector:
              </span>
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    selectedIndustry === ind
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-500 mr-2">Stage:</span>
              {stages.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStage(st)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    selectedStage === st
                      ? 'bg-accent text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : startups.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200 space-y-2">
              <p className="text-sm font-bold">No startups found matching your query.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustry('All');
                  setSelectedStage('All');
                  fetchStartups();
                }}
                className="text-xs font-bold text-accent hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((s) => (
                <div
                  key={s._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
                        {s.stage}
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {s.location}
                      </span>
                    </div>

                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-base shadow-sm flex-shrink-0">
                        {s.companyName?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-primary">{s.companyName}</h3>
                        <p className="text-xs text-slate-500 font-semibold">{s.industry}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Founded {s.foundingYear}</p>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 mb-2">"{s.tagline}"</p>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Round Target
                      </span>
                      <p className="text-sm font-extrabold text-primary">
                        {formatCurrency(s.fundingRequired)}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveStartup(s)}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      Inspect Deal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* STARTUP DETAILS MODAL */}
      {activeStartup && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg">
                  {activeStartup.companyName?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-primary">{activeStartup.companyName}</h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {activeStartup.industry} • {activeStartup.location} • Founded {activeStartup.foundingYear}
                  </p>
                  <span className="inline-block text-[11px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full mt-1">
                    {activeStartup.stage} Round
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveStartup(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                  Tagline
                </h4>
                <p className="text-sm font-bold text-slate-800">"{activeStartup.tagline}"</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                  Company Architecture & Problem Statement
                </h4>
                <p className="text-slate-700 leading-relaxed text-sm">{activeStartup.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Funding Target</span>
                  <p className="text-base font-black text-primary">
                    {formatCurrency(activeStartup.fundingRequired)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Investment Type</span>
                  <p className="text-base font-black text-primary">
                    {activeStartup.preferredInvestmentType || 'Equity'}
                  </p>
                </div>
              </div>

              {activeStartup.teamMembers && activeStartup.teamMembers.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-accent" />
                    <span>Executive Team</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {activeStartup.teamMembers.map((m, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="font-bold text-slate-800">{m.name}</p>
                        <p className="text-[11px] text-slate-500">{m.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {activeStartup.pitchDeckUrl ? (
                <a
                  href={activeStartup.pitchDeckUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-accent hover:border-accent"
                >
                  <FileText className="w-4 h-4" />
                  <span>Preview Pitch Deck</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs text-slate-400 italic">No public deck attached</span>
              )}

              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-md shadow-accent/20"
              >
                <span>Request Pitch Meeting</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

