import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import PitchDeck from '@/models/PitchDeck';
import StartupProfile from '@/models/StartupProfile';

export async function GET(request) {
  try {
    const session = getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId') || session.userId;

    await connectDB();
    const decks = await PitchDeck.find({ startupId }).sort({ createdAt: -1 });

    return NextResponse.json({ decks });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = getUserFromRequest(request);
    if (!session || session.role !== 'startup') {
      return NextResponse.json(
        { error: 'Unauthorized: Startup privileges required' },
        { status: 401 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const deckId = searchParams.get('id');

    if (deckId) {
      await PitchDeck.findOneAndDelete({ _id: deckId, startupId: session.userId });
    } else {
      await PitchDeck.deleteMany({ startupId: session.userId });
    }

    // Clear profile deck reference
    await StartupProfile.findOneAndUpdate(
      { userId: session.userId },
      { $set: { pitchDeckUrl: '' } }
    );

    return NextResponse.json({
      success: true,
      message: 'Pitch deck removed successfully',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
