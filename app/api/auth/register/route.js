import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import StartupProfile from '@/models/StartupProfile';
import InvestorProfile from '@/models/InvestorProfile';
import InvestorAvailability from '@/models/InvestorAvailability';
import { hashPassword, signToken, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password, role, companyOrFirmName } = body;

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (!['startup', 'investor'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either startup or investor' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check existing
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists' },
        { status: 409 }
      );
    }

    // Hash password & create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=536DFE&color=fff`,
    });

    // Create corresponding profile
    if (role === 'startup') {
      await StartupProfile.create({
        userId: user._id,
        companyName: companyOrFirmName || `${name.split(' ')[0]}'s Startup`,
        tagline: 'Building the future of technology',
        description: 'Describe your vision, product, market opportunity, and traction.',
        industry: 'FinTech',
        stage: 'Early Stage',
        fundingRequired: 500000,
        preferredInvestmentType: 'Equity',
        location: 'San Francisco, CA',
        completionPercentage: 40,
      });
    } else {
      await InvestorProfile.create({
        userId: user._id,
        fullName: name,
        firmName: companyOrFirmName || 'Venture Syndicate',
        title: 'Partner / Investor',
        bio: 'Angel investor and venture capitalist backing passionate founders building scalable solutions.',
        industries: ['SaaS', 'AI / ML', 'FinTech'],
        minInvestment: 50000,
        maxInvestment: 500000,
        preferredStages: ['Seed', 'Early Stage'],
        location: 'New York, NY',
        completionPercentage: 50,
      });

      // Default availability schedule for investor
      await InvestorAvailability.create({
        investorId: user._id,
        slotDurationMinutes: 30,
        timezone: 'America/New_York',
        weeklySchedule: [
          {
            dayOfWeek: 1, // Monday
            dayName: 'Monday',
            isAvailable: true,
            slots: [
              { startTime: '09:00 AM', endTime: '09:30 AM' },
              { startTime: '10:00 AM', endTime: '10:30 AM' },
              { startTime: '02:00 PM', endTime: '02:30 PM' },
              { startTime: '03:00 PM', endTime: '03:30 PM' },
            ],
          },
          {
            dayOfWeek: 2, // Tuesday
            dayName: 'Tuesday',
            isAvailable: true,
            slots: [
              { startTime: '10:00 AM', endTime: '10:30 AM' },
              { startTime: '11:00 AM', endTime: '11:30 AM' },
              { startTime: '02:30 PM', endTime: '03:00 PM' },
            ],
          },
          {
            dayOfWeek: 3, // Wednesday
            dayName: 'Wednesday',
            isAvailable: true,
            slots: [
              { startTime: '09:30 AM', endTime: '10:00 AM' },
              { startTime: '01:30 PM', endTime: '02:00 PM' },
              { startTime: '04:00 PM', endTime: '04:30 PM' },
            ],
          },
          {
            dayOfWeek: 4, // Thursday
            dayName: 'Thursday',
            isAvailable: true,
            slots: [
              { startTime: '10:00 AM', endTime: '10:30 AM' },
              { startTime: '02:00 PM', endTime: '02:30 PM' },
            ],
          },
          {
            dayOfWeek: 5, // Friday
            dayName: 'Friday',
            isAvailable: true,
            slots: [
              { startTime: '09:00 AM', endTime: '09:30 AM' },
              { startTime: '11:00 AM', endTime: '11:30 AM' },
            ],
          },
        ],
      });
    }

    // Issue JWT Token
    const token = signToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const redirectUrl =
      user.role === 'investor' ? '/dashboard/investor' : '/dashboard/startup';

    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      redirectUrl,
    });

    // Set cookie
    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error during registration' },
      { status: 500 }
    );
  }
}

