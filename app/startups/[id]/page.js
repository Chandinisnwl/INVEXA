import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { connectDB } from '@/lib/mongodb';
import StartupProfile from '@/models/StartupProfile';
import PitchDeck from '@/models/PitchDeck';
import { formatCurrency } from '@/lib/utils';
import {
  Building,
  MapPin,
  Calendar,
  Users,
  FileText,
  DollarSign,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Globe,
  Sparkles,
} from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  await connectDB();
  const startup = await StartupProfile.findOne({
    $or: [{ _id: params.id }, { userId: params.id }],
  });

  if (!startup) {
    return { title: 'Startup Not Found — INVEXA' };
  }

  return {
    title: `${startup.companyName} — Raising ${formatCurrency(startup.fundingRequired)} | INVEXA Dealflow`,
    description: `${startup.tagline}. Industry: ${startup.industry}, Stage: ${startup.stage}.`,
  };
}

export default async function StartupDetailPage({ params }) {
  await connectDB();

  let startup = null;
  try {
    startup = await StartupProfile.findOne({
      $or: [{ _id: params.id }, { userId: params.id }],
    }).populate('userId', 'name email avatar');
  } catch (err) {
    notFound();
  }

  if (!startup) {
    notFound();
  }

  const pitchDecks = await PitchDeck.find({
    startupId: startup.userId?._id || startup.userId,
  }).sort({ createdAt: -1 });

  const activeDeck = pitchDecks[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/startups" className="hover:text-primary transition-colors">Startups</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">{startup.companyName}</span>
          </nav>

          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-2xl shadow-md flex-shrink-0">
                  {startup.companyName.substring(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
                      {startup.companyName}
                    </h1>
                    <span className="inline-block text-[11px] font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
                      {startup.stage} Round
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    "{startup.tagline}"
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {startup.location || 'United States'}
                    </span>
                    <span>• Founded {startup.foundingYear}</span>
                    {startup.website && (
                      <a
                        href={startup.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:underline flex items-center gap-0.5"
                      >
                        <Globe className="w-3 h-3" /> Website
                      </a>
                    )}
                  </p>
                </div>
              </div>

              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-lg shadow-accent/25 transition-all hover:translate-y-[-1px]"
              >
                <span>Request Pitch Meeting</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Economics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-surface border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Round Target
                </span>
                <p className="text-lg font-black text-primary mt-0.5">
                  {formatCurrency(startup.fundingRequired)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Instrument: {startup.preferredInvestmentType || 'Equity'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Industry & Sector
                </span>
                <p className="text-lg font-black text-violetAccent mt-0.5">
                  {startup.industry}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">High TAM market opportunity</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pitch Deck Status
                </span>
                <p className="text-lg font-black text-emerald-600 mt-0.5">
                  {activeDeck || startup.pitchDeckUrl ? 'Audited & Verified' : 'In Review'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Ready for investor evaluation</p>
              </div>
            </div>
          </div>

          {/* Description & Team & Pitch Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-slate-100 pb-3">
                  Company Architecture & Value Proposition
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {startup.description}
                </p>
              </div>

              {startup.teamMembers && startup.teamMembers.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <span>Founding & Executive Team</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {startup.teamMembers.map((m, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-surface border border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{m.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{m.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Pitch Deck Preview */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                      Pitch Deck Preview
                    </h3>
                  </div>
                  {(activeDeck?.fileUrl || startup.pitchDeckUrl) && (
                    <a
                      href={activeDeck?.fileUrl || startup.pitchDeckUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Open PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {activeDeck?.fileUrl || startup.pitchDeckUrl ? (
                  <div className="w-full h-80 rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 shadow-inner">
                    <iframe
                      src={activeDeck?.fileUrl || startup.pitchDeckUrl}
                      title="Pitch Deck Preview"
                      className="w-full h-full border-none"
                    />
                  </div>
                ) : (
                  <div className="h-64 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                    <FileText className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-600">No public deck uploaded</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Request a meeting with the founder to receive the private investor deck.
                    </p>
                  </div>
                )}

                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <span>Sign in as Investor to Book Call</span>
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

