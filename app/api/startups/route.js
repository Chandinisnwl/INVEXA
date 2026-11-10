import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import StartupProfile from '@/models/StartupProfile';
import User from '@/models/User';
import PitchDeck from '@/models/PitchDeck';
import { hashPassword } from '@/lib/auth';

const INITIAL_STARTUPS = [
  {
    name: 'Alex Rivera',
    email: 'alex@neuralpulse.ai',
    companyName: 'NeuralPulse AI',
    tagline: 'Distributed inference acceleration for enterprise LLMs',
    description:
      'NeuralPulse builds proprietary software kernels that cut LLM serving latencies by 4x and compute hardware cost by 64%. Currently live with 18 enterprise design partners.',
    industry: 'AI / ML',
    stage: 'Early Stage',
    foundingYear: 2024,
    location: 'San Francisco, CA',
    fundingRequired: 1500000,
    preferredInvestmentType: 'Equity',
    website: 'https://neuralpulse.ai',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    pitchDeckUrl: '/sample-decks/sample-pitch-deck.pdf',
    teamMembers: [
      { name: 'Alex Rivera', role: 'CEO & Founder (ex-OpenAI researcher)' },
      { name: 'Priya Sharma', role: 'CTO (PhD Stanford Systems)' },
    ],
  },
  {
    name: 'Tariq Hassan',
    email: 'tariq@omniledger.io',
    companyName: 'OmniLedger Pay',
    tagline: 'Next-gen cross-border corporate settlement engine',
    description:
      'Automated smart contract escrow and real-time liquidity routing for international trade transactions between EMEA and North America.',
    industry: 'FinTech',
    stage: 'Early Stage',
    foundingYear: 2023,
    location: 'New York, NY',
    fundingRequired: 2200000,
    preferredInvestmentType: 'SAFE',
    website: 'https://omniledger.io',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    pitchDeckUrl: '/sample-decks/sample-pitch-deck.pdf',
    teamMembers: [
      { name: 'Tariq Hassan', role: 'CEO (ex-Stripe lead)' },
      { name: 'Chloe Dubois', role: 'Chief Risk Officer' },
    ],
  },
  {
    name: 'Dr. Evelyn Reed',
    email: 'evelyn@aerobio.health',
    companyName: 'AeroBio Health',
    tagline: 'Non-invasive biometric breathalyzer for metabolic health',
    description:
      'FDA-cleared handheld breathalyzer utilizing nano-sensors to track ketone levels, metabolic shifts, and inflammation biomarkers in real time.',
    industry: 'HealthTech',
    stage: 'MVP',
    foundingYear: 2024,
    location: 'Boston, MA',
    fundingRequired: 4000000,
    preferredInvestmentType: 'Equity',
    website: 'https://aerobio.health',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    pitchDeckUrl: '/sample-decks/sample-pitch-deck.pdf',
    teamMembers: [
      { name: 'Dr. Evelyn Reed', role: 'Founder & Chief Scientist' },
      { name: 'Markus Bauer', role: 'VP of Hardware Engineering' },
    ],
  },
  {
    name: 'Nadia Solis',
    email: 'nadia@cloudmesh.dev',
    companyName: 'CloudMesh Security',
    tagline: 'Autonomous zero-trust access gateway for cloud workloads',
    description:
      'Automating least-privilege infrastructure policy enforcement across multi-cloud Kubernetes clusters with sub-millisecond network overhead.',
    industry: 'Cybersecurity',
    stage: 'Early Stage',
    foundingYear: 2023,
    location: 'Austin, TX',
    fundingRequired: 1800000,
    preferredInvestmentType: 'SAFE',
    website: 'https://cloudmesh.dev',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    pitchDeckUrl: '/sample-decks/sample-pitch-deck.pdf',
    teamMembers: [
      { name: 'Nadia Solis', role: 'CEO (ex-Palo Alto Networks)' },
      { name: 'Leo Gomez', role: 'Head of Infrastructure' },
    ],
  },
  {
    name: 'Kiran Patel',
    email: 'kiran@agrosensor.earth',
    companyName: 'AgroSensor Earth',
    tagline: 'Hyper-local satellite and IoT soil intelligence for agriculture',
    description:
      'Combining orbital multispectral imaging with low-cost ground sensors to provide farmers precision irrigation and fertilization advisories.',
    industry: 'CleanTech',
    stage: 'Growth',
    foundingYear: 2022,
    location: 'Seattle, WA',
    fundingRequired: 3000000,
    preferredInvestmentType: 'Equity',
    website: 'https://agrosensor.earth',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    pitchDeckUrl: '/sample-decks/sample-pitch-deck.pdf',
    teamMembers: [
      { name: 'Kiran Patel', role: 'Co-Founder & CEO' },
      { name: 'Sarah Jenkins', role: 'Head of Agronomy' },
    ],
  },
];

async function ensureSeedStartups() {
  const count = await StartupProfile.countDocuments();
  if (count < 3) {
    const defaultPassword = await hashPassword('password123');
    for (const s of INITIAL_STARTUPS) {
      let user = await User.findOne({ email: s.email });
      if (!user) {
        user = await User.create({
          name: s.name,
          email: s.email,
          password: defaultPassword,
          role: 'startup',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=536DFE&color=fff`,
        });
      }

      const existingProfile = await StartupProfile.findOne({ userId: user._id });
      if (!existingProfile) {
        await StartupProfile.create({
          userId: user._id,
          companyName: s.companyName,
          tagline: s.tagline,
          description: s.description,
          industry: s.industry,
          stage: s.stage,
          foundingYear: s.foundingYear,
          location: s.location,
          fundingRequired: s.fundingRequired,
          preferredInvestmentType: s.preferredInvestmentType,
          website: s.website,
          logoUrl: s.logoUrl,
          pitchDeckUrl: s.pitchDeckUrl,
          teamMembers: s.teamMembers,
          completionPercentage: 92,
        });

        await PitchDeck.create({
          startupId: user._id,
          title: `${s.companyName} Seed Investor Deck`,
          fileName: `${s.companyName.toLowerCase().replace(/\s+/g, '-')}-pitch-deck.pdf`,
          fileUrl: s.pitchDeckUrl,
          fileSize: 3450000,
          fileType: 'application/pdf',
          summary: `${s.stage} pitch presentation for ${s.companyName}`,
        });
      }
    }
  }
}

export async function GET(request) {
  try {
    await connectDB();
    await ensureSeedStartups();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const industry = searchParams.get('industry') || '';
    const stage = searchParams.get('stage') || '';
    const location = searchParams.get('location') || '';
    const minFunding = searchParams.get('minFunding') ? Number(searchParams.get('minFunding')) : null;
    const maxFunding = searchParams.get('maxFunding') ? Number(searchParams.get('maxFunding')) : null;
    const id = searchParams.get('id');

    if (id) {
      const startup = await StartupProfile.findOne({
        $or: [{ _id: id }, { userId: id }],
      }).populate('userId', 'name email avatar');

      if (!startup) {
        return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
      }

      const pitchDecks = await PitchDeck.find({
        startupId: startup.userId._id || startup.userId,
      }).sort({ createdAt: -1 });

      return NextResponse.json({ startup, pitchDecks });
    }

    const filter = {};

    if (q) {
      filter.$or = [
        { companyName: { $regex: q, $options: 'i' } },
        { tagline: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    if (industry && industry !== 'All') {
      filter.industry = new RegExp(industry, 'i');
    }

    if (stage && stage !== 'All') {
      filter.stage = stage;
    }

    if (location && location !== 'All') {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (minFunding !== null && !isNaN(minFunding)) {
      filter.fundingRequired = { $gte: minFunding };
    }

    if (maxFunding !== null && !isNaN(maxFunding)) {
      if (filter.fundingRequired) {
        filter.fundingRequired.$lte = maxFunding;
      } else {
        filter.fundingRequired = { $lte: maxFunding };
      }
    }

    const startups = await StartupProfile.find(filter)
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 });

    return NextResponse.json({ startups });
  } catch (error) {
    console.error('Fetch startups error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
