import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import InvestorProfile from '@/models/InvestorProfile';
import User from '@/models/User';
import InvestorAvailability from '@/models/InvestorAvailability';
import { hashPassword } from '@/lib/auth';

const INITIAL_INVESTORS = [
  {
    name: 'Marcus Vance',
    email: 'marcus@horizoncap.vc',
    firmName: 'Horizon Capital Ventures',
    title: 'General Partner',
    bio: 'Lead partner investing across Seed to Series A in enterprise SaaS, developer tooling, and foundational AI models. 12+ years of operating experience.',
    industries: ['AI / ML', 'Enterprise SaaS', 'Cloud Infra'],
    minInvestment: 250000,
    maxInvestment: 2000000,
    preferredStages: ['Seed', 'Early Stage', 'Growth'],
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    website: 'https://horizoncap.vc',
  },
  {
    name: 'Elena Rostova',
    email: 'elena@beaconangels.com',
    firmName: 'Beacon Angel Syndicate',
    title: 'Lead Angel & Former FinTech CTO',
    bio: 'Active angel backing 15+ FinTech, cybersecurity, and Web3 infrastructure companies. Focuses on founder product obsession.',
    industries: ['FinTech', 'Cybersecurity', 'Web3'],
    minInvestment: 50000,
    maxInvestment: 500000,
    preferredStages: ['Idea', 'MVP', 'Seed'],
    location: 'New York, NY',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    website: 'https://beaconangels.com',
  },
  {
    name: 'David Chen',
    email: 'david@apexfrontier.vc',
    firmName: 'Apex Frontier Fund',
    title: 'Managing Director',
    bio: 'Investing institutional tickets in frontier technologies: deeptech, robotics, synthetic biology, and computational health.',
    industries: ['HealthTech', 'Robotics', 'CleanTech', 'DeepTech'],
    minInvestment: 500000,
    maxInvestment: 3500000,
    preferredStages: ['Early Stage', 'Growth'],
    location: 'Boston, MA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    website: 'https://apexfrontier.vc',
  },
  {
    name: 'Sophia Al-Mansoor',
    email: 'sophia@oasisventures.io',
    firmName: 'Oasis Global Ventures',
    title: 'Founding Partner',
    bio: 'Backing global cross-border consumer tech, commerce enablement, and creator economy platforms scaling internationally.',
    industries: ['Consumer Tech', 'E-Commerce', 'FinTech'],
    minInvestment: 100000,
    maxInvestment: 1000000,
    preferredStages: ['MVP', 'Early Stage'],
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    website: 'https://oasisventures.io',
  },
  {
    name: 'Liam Gallagher',
    email: 'liam@celticbridge.vc',
    firmName: 'Celtic Bridge Capital',
    title: 'Venture Partner',
    bio: 'Focused on European and transatlantic B2B SaaS platforms. Strong network with enterprise procurement and buyers.',
    industries: ['Enterprise SaaS', 'Supply Chain', 'FinTech'],
    minInvestment: 200000,
    maxInvestment: 1500000,
    preferredStages: ['Seed', 'Early Stage'],
    location: 'Chicago, IL',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    website: 'https://celticbridge.vc',
  },
  {
    name: 'Maya Patel',
    email: 'maya@greencatalyst.fund',
    firmName: 'GreenCatalyst Fund',
    title: 'Investment Principal',
    bio: 'Committed to climate change mitigation, sustainable agriculture, and renewable grid software infrastructure.',
    industries: ['CleanTech', 'Agritech', 'AI / ML'],
    minInvestment: 150000,
    maxInvestment: 1200000,
    preferredStages: ['Seed', 'Early Stage'],
    location: 'Seattle, WA',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
    website: 'https://greencatalyst.fund',
  },
];

async function ensureSeedInvestors() {
  const count = await InvestorProfile.countDocuments();
  if (count < 3) {
    const defaultPassword = await hashPassword('password123');
    for (const inv of INITIAL_INVESTORS) {
      let user = await User.findOne({ email: inv.email });
      if (!user) {
        user = await User.create({
          name: inv.name,
          email: inv.email,
          password: defaultPassword,
          role: 'investor',
          avatar: inv.avatar,
        });
      }

      const existingProfile = await InvestorProfile.findOne({ userId: user._id });
      if (!existingProfile) {
        await InvestorProfile.create({
          userId: user._id,
          fullName: inv.name,
          firmName: inv.firmName,
          title: inv.title,
          bio: inv.bio,
          avatarUrl: inv.avatar,
          industries: inv.industries,
          minInvestment: inv.minInvestment,
          maxInvestment: inv.maxInvestment,
          preferredStages: inv.preferredStages,
          location: inv.location,
          website: inv.website,
          completionPercentage: 90,
        });

        // Seed availability
        await InvestorAvailability.create({
          investorId: user._id,
          slotDurationMinutes: 30,
          weeklySchedule: [
            {
              dayOfWeek: 1,
              dayName: 'Monday',
              isAvailable: true,
              slots: [
                { startTime: '09:00 AM', endTime: '09:30 AM' },
                { startTime: '11:00 AM', endTime: '11:30 AM' },
                { startTime: '03:00 PM', endTime: '03:30 PM' },
              ],
            },
            {
              dayOfWeek: 3,
              dayName: 'Wednesday',
              isAvailable: true,
              slots: [
                { startTime: '10:00 AM', endTime: '10:30 AM' },
                { startTime: '02:00 PM', endTime: '02:30 PM' },
              ],
            },
            {
              dayOfWeek: 5,
              dayName: 'Friday',
              isAvailable: true,
              slots: [
                { startTime: '01:00 PM', endTime: '01:30 PM' },
                { startTime: '03:30 PM', endTime: '04:00 PM' },
              ],
            },
          ],
        });
      }
    }
  }
}

export async function GET(request) {
  try {
    await connectDB();
    await ensureSeedInvestors();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const industry = searchParams.get('industry') || '';
    const stage = searchParams.get('stage') || '';
    const location = searchParams.get('location') || '';
    const minCheck = searchParams.get('minCheck') ? Number(searchParams.get('minCheck')) : null;
    const maxCheck = searchParams.get('maxCheck') ? Number(searchParams.get('maxCheck')) : null;
    const id = searchParams.get('id');

    // Single investor details request
    if (id) {
      const investor = await InvestorProfile.findOne({
        $or: [{ _id: id }, { userId: id }],
      }).populate('userId', 'name email avatar');

      if (!investor) {
        return NextResponse.json({ error: 'Investor not found' }, { status: 404 });
      }

      // Also get availability
      const availability = await InvestorAvailability.findOne({
        investorId: investor.userId._id || investor.userId,
      });

      return NextResponse.json({ investor, availability });
    }

    // Build filter query
    const filter = {};

    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { firmName: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
      ];
    }

    if (industry && industry !== 'All') {
      filter.industries = { $in: [new RegExp(industry, 'i')] };
    }

    if (stage && stage !== 'All') {
      filter.preferredStages = { $in: [new RegExp(stage, 'i')] };
    }

    if (location && location !== 'All') {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (minCheck !== null && !isNaN(minCheck)) {
      filter.maxInvestment = { $gte: minCheck };
    }

    if (maxCheck !== null && !isNaN(maxCheck)) {
      filter.minInvestment = { $lte: maxCheck };
    }

    const investors = await InvestorProfile.find(filter)
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 });

    return NextResponse.json({ investors });
  } catch (error) {
    console.error('Fetch investors error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
