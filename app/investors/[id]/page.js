import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { connectDB } from '@/lib/mongodb';
import InvestorProfile from '@/models/InvestorProfile';
import InvestorAvailability from '@/models/InvestorAvailability';
import User from '@/models/User';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldCheck,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  ArrowRight,
  Globe,
  Linkedin,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

// Next.js ISR (Incremental Static Regeneration) — Revalidate every 60 seconds
export const revalidate = 60;

// Dynamic Metadata Generation for SEO
export async function generateMetadata({ params }) {
  await connectDB();
  const investor = await InvestorProfile.findOne({
    $or: [{ _id: params.id }, { userId: params.id }],
  }).populate('userId', 'name avatar');

  if (!investor) {
    return {
      title: 'Investor Not Found — INVEXA',
    };
  }

  return {
    title: `${investor.fullName} — ${investor.firmName} | INVEXA Partner`,
    description: `Pitch to ${investor.fullName} (${investor.title} at ${investor.firmName}). Check size: ${formatCurrency(investor.minInvestment)} - ${formatCurrency(investor.maxInvestment)}.`,
  };
}

// Server Component demonstrating Server-Side Data Fetching & Dynamic Routing
export default async function InvestorDetailPage({ params }) {
  await connectDB();

  let investor = null;
  try {
    investor = await InvestorProfile.findOne({
      $or: [{ _id: params.id }, { userId: params.id }],
    }).populate('userId', 'name email avatar');
  } catch (err) {
    // If invalid ObjectId format
    notFound();
  }

  if (!investor) {
    notFound();
  }

  const availability = await InvestorAvailability.findOne({
    investorId: investor.userId?._id || investor.userId,
  });

  const weeklySchedule = availability?.weeklySchedule || [];
  const openDays = weeklySchedule.filter((d) => d.isAvailable);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb Navigation using Next.js Link */}
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/investors" className="hover:text-primary transition-colors">Investors</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">{investor.fullName}</span>
          </nav>

          {/* Hero Profile Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-5">
                <img
                  src={
                    investor.avatarUrl ||
                    investor.userId?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
                  }
                  alt={investor.fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-md flex-shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
                      {investor.fullName}
                    </h1>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Allocator
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-violetAccent">
                    {investor.title} • {investor.firmName}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {investor.location || 'United States'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/dashboard/startup/book?investorId=${investor.userId?._id || investor.userId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-lg shadow-accent/25 transition-all hover:translate-y-[-1px]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Pitch Meeting</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Check Size & Thesis Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-surface border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Target Check Range
                </span>
                <p className="text-lg font-black text-primary mt-0.5">
                  {formatCurrency(investor.minInvestment)} - {formatCurrency(investor.maxInvestment)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Direct institutional / angel ticket</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Preferred Stages
                </span>
                <p className="text-lg font-black text-violetAccent mt-0.5">
                  {(investor.preferredStages || ['Seed', 'Early Stage']).join(', ')}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Active capital allocation rounds</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Partner Response Rate
                </span>
                <p className="text-lg font-black text-emerald-600 mt-0.5">94% Within 48 Hrs</p>
                <p className="text-[11px] text-slate-500 mt-0.5">High responsiveness guarantee</p>
              </div>
            </div>
          </div>

          {/* Details & Biography */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 cols: Thesis & Sectors */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-slate-100 pb-3">
                  Investment Thesis & Background
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {investor.bio ||
                    'Active venture investor backing visionary technical founders solving complex industry problems with defensible architectures.'}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-slate-100 pb-3">
                  Focus Sectors & Core Industries
                </h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(investor.industries || ['AI / ML', 'Enterprise SaaS', 'FinTech']).map((ind, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-violetAccent/10 text-violetAccent text-xs font-semibold border border-violetAccent/20"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 cols: Weekly Availability Preview */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Clock className="w-4 h-4 text-accent" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Open Pitch Availability
                  </h3>
                </div>

                {openDays.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3">Schedule updated weekly.</p>
                ) : (
                  <div className="space-y-2.5">
                    {openDays.map((d) => (
                      <div
                        key={d.dayOfWeek}
                        className="p-3 rounded-xl bg-surface border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-800">{d.dayName}</span>
                        <span className="font-semibold text-accent">
                          {d.slots?.length || 2} Open Slots
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href={`/dashboard/startup/book?investorId=${investor.userId?._id || investor.userId}`}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-md shadow-accent/20 transition-all"
                >
                  <span>Select Time Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

