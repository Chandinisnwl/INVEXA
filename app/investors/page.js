'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function InvestorDiscoveryPage() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [maxCheck, setMaxCheck] = useState('');

  // Modal for viewing full investor details
  const [activeInvestor, setActiveInvestor] = useState(null);

  const fetchInvestors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (selectedIndustry !== 'All') params.append('industry', selectedIndustry);
      if (selectedStage !== 'All') params.append('stage', selectedStage);
      if (selectedLocation !== 'All') params.append('location', selectedLocation);
      if (maxCheck) params.append('maxCheck', maxCheck);

      const res = await fetch(`/api/investors?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInvestors(data.investors || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, [selectedIndustry, selectedStage, selectedLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInvestors();
  };

  const industries = ['All', 'AI / ML', 'Enterprise SaaS', 'FinTech', 'HealthTech', 'CleanTech', 'Cybersecurity'];
  const stages = ['All', 'Idea', 'MVP', 'Seed', 'Early Stage', 'Growth'];
  const locations = ['All', 'San Francisco', 'New York', 'Boston', 'Austin', 'Seattle', 'Chicago'];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
            <span className="text-xs font-bold tracking-wider text-accent uppercase bg-accent/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accredited Allocators Network</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight">
              Discover & Pitch Active Investors
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Filter venture funds, angel syndicates, and family offices by thesis, target check size, and open calendar availability.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by investor name, firm, or investment thesis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Max check ($)"
                  value={maxCheck}
                  onChange={(e) => setMaxCheck(e.target.value)}
                  className="w-36 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-md shadow-accent/20 transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filter Pills */}
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
                      ? 'bg-violetAccent text-white'
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
          ) : investors.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200 space-y-2">
              <p className="text-sm font-bold">No investors matched your filter parameters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustry('All');
                  setSelectedStage('All');
                  setSelectedLocation('All');
                  setMaxCheck('');
                  fetchInvestors();
                }}
                className="text-xs font-bold text-accent hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investors.map((inv) => (
                <div
                  key={inv._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all card-hover flex flex-col justify-between"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified Allocator</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {inv.location}
                      </span>
                    </div>

                    {/* Bio & Avatar */}
                    <div className="flex items-start gap-4 mb-3">
                      <img
                        src={inv.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                        alt={inv.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm flex-shrink-0"
                      />
                      <div>
                        <h3 className="text-base font-extrabold text-primary">{inv.fullName}</h3>
                        <p className="text-xs text-slate-500 font-semibold">{inv.title}</p>
                        <p className="text-xs font-bold text-violetAccent mt-0.5">{inv.firmName}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {inv.bio}
                    </p>

                    {/* Sectors */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(inv.industries || []).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Check Size
                      </span>
                      <p className="text-sm font-extrabold text-primary">
                        {formatCurrency(inv.minInvestment)} - {formatCurrency(inv.maxInvestment)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveInvestor(inv)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Profile
                      </button>
                      <Link
                        href={`/dashboard/startup/book?investorId=${inv.userId?._id || inv.userId}`}
                        className="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-sm transition-all"
                      >
                        Book Pitch
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* INVESTOR PROFILE DETAILS MODAL */}
      {activeInvestor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={activeInvestor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt={activeInvestor.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-primary">{activeInvestor.fullName}</h3>
                  <p className="text-xs font-bold text-violetAccent">
                    {activeInvestor.title} • {activeInvestor.firmName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{activeInvestor.location}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveInvestor(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                  Investment Thesis & Bio
                </h4>
                <p className="text-slate-700 leading-relaxed text-sm">{activeInvestor.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Check Range</span>
                  <p className="text-sm font-black text-primary">
                    {formatCurrency(activeInvestor.minInvestment)} - {formatCurrency(activeInvestor.maxInvestment)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Preferred Stages</span>
                  <p className="text-sm font-black text-primary">
                    {(activeInvestor.preferredStages || ['Early Stage']).join(', ')}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">
                  Target Industries
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(activeInvestor.industries || []).map((ind, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-violetAccent/10 text-violetAccent font-semibold"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActiveInvestor(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                Close
              </button>

              <Link
                href={`/dashboard/startup/book?investorId=${activeInvestor.userId?._id || activeInvestor.userId}`}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-md shadow-accent/20"
              >
                <span>Book a Pitch Meeting</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

