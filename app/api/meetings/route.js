import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Meeting from '@/models/Meeting';
import User from '@/models/User';
import StartupProfile from '@/models/StartupProfile';
import InvestorProfile from '@/models/InvestorProfile';
import Notification from '@/models/Notification';

export async function GET(request) {
  try {
    const session = getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const meetingId = searchParams.get('id');

    if (meetingId) {
      const meeting = await Meeting.findById(meetingId)
        .populate('startupId', 'name email avatar')
        .populate('investorId', 'name email avatar');

      if (!meeting) {
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
      }
      return NextResponse.json({ meeting });
    }

    const query = {};
    if (session.role === 'startup') {
      query.startupId = session.userId;
    } else {
      query.investorId = session.userId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const meetings = await Meeting.find(query)
      .populate('startupId', 'name email avatar')
      .populate('investorId', 'name email avatar')
      .sort({ date: 1, createdAt: -1 });

    // Also fetch associated profiles for richer UI context
    const enrichedMeetings = await Promise.all(
      meetings.map(async (m) => {
        const obj = m.toObject();
        if (session.role === 'startup') {
          const invProfile = await InvestorProfile.findOne({ userId: m.investorId._id });
          obj.otherProfile = invProfile;
        } else {
          const startProfile = await StartupProfile.findOne({ userId: m.startupId._id });
          obj.otherProfile = startProfile;
        }
        return obj;
      })
    );

    return NextResponse.json({ meetings: enrichedMeetings });
  } catch (error) {
    console.error('Fetch meetings error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { investorId, title, description, date, timeSlot } = body;

    if (!investorId || !title || !date || !timeSlot) {
      return NextResponse.json(
        { error: 'Please provide investor, meeting title, date, and time slot.' },
        { status: 400 }
      );
    }

    // Double booking prevention rule
    const existingBooking = await Meeting.findOne({
      investorId,
      date,
      timeSlot,
      status: { $in: ['Pending', 'Accepted'] },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This time slot is already booked for this investor. Please choose another slot.' },
        { status: 409 }
      );
    }

    // Startup profile info for pitch deck attachment
    const startupProfile = await StartupProfile.findOne({ userId: session.userId });

    const meeting = await Meeting.create({
      startupId: session.userId,
      investorId,
      title: title.trim(),
      description: description ? description.trim() : '',
      date,
      timeSlot,
      status: 'Pending',
      pitchDeckUrl: startupProfile?.pitchDeckUrl || '',
      requestedBy: session.role,
      meetingLink: `https://meet.google.com/inv-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`,
    });

    // Send notification to Investor
    const startupName = startupProfile?.companyName || session.name;
    await Notification.create({
      recipientId: investorId,
      senderId: session.userId,
      type: 'pitch_request',
      title: 'New Pitch Meeting Request',
      message: `${startupName} has requested a 30-min pitch slot on ${date} (${timeSlot}).`,
      link: '/dashboard/investor/requests',
    });

    return NextResponse.json({
      success: true,
      message: 'Pitch meeting request successfully submitted',
      meeting,
    });
  } catch (error) {
    console.error('Create meeting error:', error);
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
    const body = await request.json();
    const { meetingId, status, date, timeSlot, notes } = body;

    if (!meetingId) {
      return NextResponse.json({ error: 'Meeting ID required' }, { status: 400 });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Authorization check
    const isOwner =
      meeting.startupId.toString() === session.userId ||
      meeting.investorId.toString() === session.userId;

    if (!isOwner) {
      return NextResponse.json({ error: 'Unauthorized to modify this meeting' }, { status: 403 });
    }

    const updates = {};
    if (status) updates.status = status;
    if (date) updates.date = date;
    if (timeSlot) updates.timeSlot = timeSlot;
    if (notes !== undefined) updates.notes = notes;

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { $set: updates },
      { new: true }
    );

    // Create notifications for other party
    const targetRecipient =
      session.userId === meeting.startupId.toString()
        ? meeting.investorId
        : meeting.startupId;

    if (status) {
      let notifTitle = `Meeting ${status}`;
      let notifMsg = `Your pitch meeting for "${meeting.title}" on ${meeting.date} has been ${status.toLowerCase()}.`;

      if (status === 'Accepted') {
        notifTitle = '🎉 Pitch Request Accepted!';
        notifMsg = `Your pitch meeting "${meeting.title}" on ${meeting.date} at ${meeting.timeSlot} was accepted. Meet link: ${meeting.meetingLink}`;
      } else if (status === 'Rejected') {
        notifTitle = 'Pitch Request Declined';
        notifMsg = `Your meeting request for "${meeting.title}" was not accepted at this time.`;
      } else if (status === 'Cancelled') {
        notifTitle = 'Meeting Cancelled';
        notifMsg = `The pitch meeting "${meeting.title}" on ${meeting.date} was cancelled.`;
      }

      await Notification.create({
        recipientId: targetRecipient,
        senderId: session.userId,
        type: `meeting_${status.toLowerCase()}`,
        title: notifTitle,
        message: notifMsg,
        link: session.role === 'startup' ? '/dashboard/investor/meetings' : '/dashboard/startup/meetings',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Meeting ${status || 'updated'} successfully`,
      meeting: updatedMeeting,
    });
  } catch (error) {
    console.error('Update meeting error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
