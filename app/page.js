import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Briefcase,
  Users,
  Building,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Search,
  FileText,
  Star,
  DollarSign,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  const stats = [
    { label: 'Registered Startups', value: '1,420+', icon: Building, color: 'text-accent' },
    { label: 'Verified Investors', value: '520+', icon: Users, color: 'text-violetAccent' },
    { label: 'Pitch Meetings Booked', value: '3,850+', icon: Calendar, color: 'text-emerald-500' },
    { label: 'Capital Deployed', value: '$145M+', icon: DollarSign, color: 'text-amber-500' },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Craft Profile & Pitch Deck',
      description:
        'Startups build a comprehensive profile detailing market traction, team credentials, valuation targets, and upload their verified PDF pitch deck.',
      badge: 'Step 1: Setup',
      icon: FileText,
    },
    {
      step: '02',
      title: 'Discover & Matchmaking',
      description:
        'Advanced multi-parameter discovery lets founders filter angel syndicates and venture funds by check size, sector thesis, and stage.',
      badge: 'Step 2: Connect',
      icon: Compass,
    },
    {
      step: '03',
      title: 'Direct Pitch Calendar Booking',
      description:
        'Eliminate email back-and-forth. Startups select available investor time slots, propose an agenda, and sync Google Meet/Zoom video calls directly.',
      badge: 'Step 3: Close',
      icon: Calendar,
    },
  ];

  const featuredStartups = [
    {
      name: 'NeuralPulse AI',
      stage: 'Seed',
      industry: 'AI & Data Infrastructure',
      target: '$1,500,000',
      description: 'Distributed inference acceleration engine cutting LLM hosting compute costs by 64%.',
      location: 'San Francisco, CA',
      completion: 95,
    },
    {
      name: 'OmniLedger Pay',
      stage: 'Early Stage',
      industry: 'FinTech',
      target: '$2,200,000',
      description: 'Next-generation cross-border B2B settlement protocol with automated compliance.',
      location: 'New York, NY',
      completion: 90,
    },
    {
      name: 'AeroBio Health',
      stage: 'Series A',
      industry: 'HealthTech',
      target: '$4,000,000',
      description: 'Non-invasive biometric breathalyzer detecting cellular biomarkers in real-time.',
      location: 'Boston, MA',
      completion: 100,
    },
  ];

  const featuredInvestors = [
    {
      name: 'Marcus Vance',
      firm: 'Horizon Capital Ventures',
      title: 'General Partner',
      range: '$250K - $2M',
      focus: ['AI / ML', 'Enterprise SaaS', 'Cloud Infra'],
      location: 'Silicon Valley, CA',
      verified: true,
      meetingsCompleted: 84,
    },
    {
      name: 'Elena Rostova',
      firm: 'Beacon Angel Syndicate',
      title: 'Lead Angel & Former CTO',
      range: '$50K - $500K',
      focus: ['FinTech', 'Web3', 'Cybersecurity'],
      location: 'New York, NY',
      verified: true,
      meetingsCompleted: 62,
    },
    {
      name: 'David Chen',
      firm: 'Apex Frontier Fund',
      title: 'Managing Director',
      range: '$500K - $3.5M',
      focus: ['HealthTech', 'Robotics', 'CleanTech'],
      location: 'Boston, MA',
      verified: true,
      meetingsCompleted: 110,
    },
  ];

  const whyChooseUs = [
    {
      title: 'Verified Venture Network',
      desc: 'Every startup and investor is vetted. No fake brokers, spam solicitations, or phantom fund managers.',
      icon: ShieldCheck,
    },
    {
      title: 'Direct Frictionless Booking',
      desc: 'Seamless two-way synchronized availability slots. Book pitches directly without endless emails.',
      icon: Calendar,
    },
    {
      title: 'Secure Deck Vault',
      desc: 'Upload, manage versions, and control who views your pitch materials with granular access rules.',
      icon: FileText,
    },
    {
      title: 'Real-time Funnel Analytics',
      desc: 'Track meeting request status, acceptance velocity, and investor engagement metrics on your dashboard.',
      icon: TrendingUp,
    },
  ];

  const testimonials = [
    {
      quote:
        'INVEXA cut our fundraising timeline from six months to three weeks. We booked 14 partner meetings in five days and closed our $1.8M seed round.',
      author: 'Sarah Lin',
      role: 'CEO & Founder, SynapseCore',
      badge: 'Raised $1.8M Seed',
    },
    {
      quote:
        'As an active angel investing in 12 deals a year, INVEXA is the cleanest dealflow system I have used. High-signal pitch decks with calibrated time slots.',
      author: 'Julian Thorne',
      role: 'Partner, Starlight Ventures',
      badge: 'Deployed $4.2M in 2026',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-white via-surface to-slate-50 border-b border-slate-200/70">
          {/* Subtle geometric background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-accent/5 via-violetAccent/5 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headline & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Modern Venture Capital Matchmaking SaaS</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-[1.12]">
                  Where Ambition <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-violetAccent to-accent">
                    Meets Investment.
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Empowering startups to connect with the right investors, showcase their vision, and turn fundraising opportunities into meaningful partnerships.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Link
                    href="/investors"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-lg shadow-accent/25 transition-all hover:translate-y-[-1px]"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Investors</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  <Link
                    href="/register?role=investor"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-primary bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all hover:translate-y-[-1px]"
                  >
                    <Briefcase className="w-4 h-4 text-violetAccent" />
                    <span>Join as Investor</span>
                  </Link>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-6 pt-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Startup Profile
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Direct Calendar Sync
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Accreditations
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Interactive VC Illustration Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md bg-white rounded-2xl p-6 shadow-2xl shadow-primary/10 border border-slate-200/80">
                  {/* Visual simulated pitch session card */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold">
                        IX
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary">Pitch Request #4208</h4>
                        <p className="text-xs text-slate-500">Live Matchmaking Session</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Slot Confirmed
                    </span>
                  </div>

                  {/* Connected visual cards */}
                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">
                          NP
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">NeuralPulse AI</p>
                          <p className="text-[11px] text-slate-500">Seeking $1.5M Seed • AI Infra</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-1 rounded">
                        Deck Attached
                      </span>
                    </div>

                    {/* Vector connector */}
                    <div className="flex items-center justify-center py-0.5">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        <TrendingUp className="w-3.5 h-3.5 text-accent" />
                        <span>Direct 30-Min Pitch Slot</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-violetAccent text-white flex items-center justify-center text-xs font-bold">
                          HC
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Marcus Vance</p>
                          <p className="text-[11px] text-slate-500">Horizon Capital • $2M Check</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-violetAccent bg-violetAccent/10 px-2 py-1 rounded">
                        General Partner
                      </span>
                    </div>
                  </div>

                  {/* Booking details preview */}
                  <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-r from-accent/5 to-violetAccent/5 border border-accent/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span>Tomorrow, 2:30 PM EST</span>
                    </div>
                    <span className="font-semibold text-accent hover:underline">Google Meet</span>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white rounded-xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce duration-1000">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">$145M+ Raised</p>
                    <p className="text-[10px] text-slate-500">Across 220+ Closed Rounds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORM STATISTICS SECTION */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-surface border border-slate-100 text-center hover:border-slate-200 transition-colors"
                  >
                    <div className="inline-flex p-2.5 rounded-xl bg-white shadow-sm mb-3">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <p className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold tracking-wider text-accent uppercase bg-accent/10 px-3 py-1 rounded-full">
                Streamlined Dealflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                How INVEXA Works
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                We replaced cold emails and clunky spreadsheets with an automated, transparent venture bridge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="relative bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-4xl font-black text-slate-200 font-mono">
                          {step.step}
                        </span>
                        <div className="p-3 rounded-xl bg-slate-50 text-accent border border-slate-100">
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-accent">
                        {step.badge}
                      </span>
                      <h3 className="text-xl font-bold text-primary mt-1 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED STARTUPS & INVESTORS DUAL SHOWCASE */}
        <section id="featured" className="py-20 bg-white border-t border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            {/* Startups Column */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-bold text-accent tracking-wider uppercase">
                    High Traction Deals
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-primary">
                    Featured Startups Raising Now
                  </h3>
                </div>
                <Link
                  href="/startups"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover"
                >
                  <span>Explore all startups</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredStartups.map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-surface rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                          {s.stage}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {s.location}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-primary">{s.name}</h4>
                      <p className="text-xs text-slate-500 font-medium mb-3">{s.industry}</p>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {s.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Target</span>
                        <p className="text-base font-extrabold text-primary">{s.target}</p>
                      </div>
                      <Link
                        href={`/startups`}
                        className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                      >
                        View Pitch
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investors Column */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-bold text-violetAccent tracking-wider uppercase">
                    Active Capital Allocators
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-primary">
                    Featured Verified Investors
                  </h3>
                </div>
                <Link
                  href="/investors"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-violetAccent hover:text-violetAccent-hover"
                >
                  <span>Explore all investors</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredInvestors.map((inv, idx) => (
                  <div
                    key={idx}
                    className="bg-surface rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-700">Verified Angel/VC</span>
                        </div>
                        <span className="text-xs text-slate-500">{inv.location}</span>
                      </div>
                      <h4 className="text-lg font-bold text-primary">{inv.name}</h4>
                      <p className="text-xs text-slate-500 font-medium mb-3">
                        {inv.title} • <span className="text-slate-700">{inv.firm}</span>
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {inv.focus.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Check Size</span>
                        <p className="text-base font-extrabold text-primary">{inv.range}</p>
                      </div>
                      <Link
                        href={`/investors`}
                        className="px-3.5 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors"
                      >
                        Book Pitch
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE INVEXA */}
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold tracking-wider text-accent uppercase bg-accent/10 px-3 py-1 rounded-full">
                Venture Infrastructure
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                Engineered for High-Stakes Fundraising
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Everything you need to showcase, evaluate, schedule, and track startup investment meetings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="p-3 rounded-xl bg-accent/10 text-accent w-fit mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl font-extrabold text-primary">Backing Founders & Capital Partners</h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">Real results from participants in the INVEXA network.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-surface border border-slate-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-700 italic leading-relaxed text-sm sm:text-base">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-200 mt-6 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-primary text-sm">{t.author}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-accent/10 text-accent">
                      {t.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-20 bg-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-violetAccent/20 pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Accelerate Your Venture Journey?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Join hundreds of visionary founders and accredited venture funds closing deals on INVEXA.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register?role=startup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-base shadow-lg shadow-accent/30 transition-all hover:translate-y-[-1px]"
              >
                Register Your Startup
              </Link>
              <Link
                href="/register?role=investor"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base border border-slate-700 transition-all hover:translate-y-[-1px]"
              >
                Apply as Investor
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

