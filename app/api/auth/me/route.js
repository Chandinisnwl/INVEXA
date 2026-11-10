import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';
import StartupProfile from '@/models/StartupProfile';
import InvestorProfile from '@/models/InvestorProfile';

export async function GET(request) {
  try {
    const session = getUserFromRequest(request);
    if (!session || !session.userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId).select('-password');
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    let profile = null;
    if (user.role === 'startup') {
      profile = await StartupProfile.findOne({ userId: user._id });
    } else {
      profile = await InvestorProfile.findOne({ userId: user._id });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      profile,
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
