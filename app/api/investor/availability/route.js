import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import InvestorAvailability from '@/models/InvestorAvailability';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const investorId = searchParams.get('investorId');

    const session = getUserFromRequest(request);
    const targetId = investorId || session?.userId;

    if (!targetId) {
      return NextResponse.json({ error: 'Investor ID required' }, { status: 400 });
    }

    await connectDB();
    let availability = await InvestorAvailability.findOne({ investorId: targetId });

    if (!availability) {
      // Create default
      availability = await InvestorAvailability.create({
        investorId: targetId,
        slotDurationMinutes: 30,
        weeklySchedule: [
          {
            dayOfWeek: 1,
            dayName: 'Monday',
            isAvailable: true,
            slots: [
              { startTime: '10:00 AM', endTime: '10:30 AM' },
              { startTime: '02:00 PM', endTime: '02:30 PM' },
            ],
          },
          {
            dayOfWeek: 2,
            dayName: 'Tuesday',
            isAvailable: true,
            slots: [
              { startTime: '11:00 AM', endTime: '11:30 AM' },
              { startTime: '03:00 PM', endTime: '03:30 PM' },
            ],
          },
          {
            dayOfWeek: 3,
            dayName: 'Wednesday',
            isAvailable: true,
            slots: [
              { startTime: '01:00 PM', endTime: '01:30 PM' },
              { startTime: '04:00 PM', endTime: '04:30 PM' },
            ],
          },
          {
            dayOfWeek: 4,
            dayName: 'Thursday',
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
              { startTime: '09:30 AM', endTime: '10:00 AM' },
            ],
          },
        ],
      });
    }

    return NextResponse.json({ availability });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = getUserFromRequest(request);
    if (!session || session.role !== 'investor') {
      return NextResponse.json({ error: 'Unauthorized: Investor access only' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { weeklySchedule, slotDurationMinutes, timezone } = body;

    const updates = {};
    if (weeklySchedule) updates.weeklySchedule = weeklySchedule;
    if (slotDurationMinutes) updates.slotDurationMinutes = slotDurationMinutes;
    if (timezone) updates.timezone = timezone;

    const availability = await InvestorAvailability.findOneAndUpdate(
      { investorId: session.userId },
      { $set: updates },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Availability schedule saved successfully',
      availability,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
