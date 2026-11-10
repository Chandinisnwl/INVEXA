import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import StartupProfile from '@/models/StartupProfile';
import { calculateProfileCompletion } from '@/lib/utils';

export async function GET(request) {
  try {
    const session = getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const profile = await StartupProfile.findOne({ userId: session.userId });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const updates = await request.json();

    // Recalculate profile completion
    const completionPercentage = calculateProfileCompletion(updates, 'startup');
    updates.completionPercentage = completionPercentage;

    const profile = await StartupProfile.findOneAndUpdate(
      { userId: session.userId },
      { $set: updates },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Startup profile updated successfully',
      profile,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
