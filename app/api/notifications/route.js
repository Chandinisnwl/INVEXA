import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Notification from '@/models/Notification';

export async function GET(request) {
  try {
    const session = getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const notifications = await Notification.find({ recipientId: session.userId })
      .populate('senderId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(30);

    return NextResponse.json({ notifications });
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
    const body = await request.json().catch(() => ({}));
    const { notificationId } = body;

    if (notificationId) {
      await Notification.findOneAndUpdate(
        { _id: notificationId, recipientId: session.userId },
        { $set: { read: true } }
      );
    } else {
      // Mark all read
      await Notification.updateMany(
        { recipientId: session.userId, read: false },
        { $set: { read: true } }
      );
    }

    return NextResponse.json({ success: true, message: 'Notifications updated' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
