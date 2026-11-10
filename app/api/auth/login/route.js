import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import StartupProfile from '@/models/StartupProfile';
import InvestorProfile from '@/models/InvestorProfile';
import InvestorAvailability from '@/models/InvestorAvailability';
import { comparePassword, hashPassword, signToken, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password, demoRole } = body;

    // Handle instant demo login
    if (demoRole) {
      let demoEmail = demoRole === 'investor' ? 'investor@invexa.com' : 'founder@invexa.com';
      let user = await User.findOne({ email: demoEmail });

      // If demo user doesn't exist yet, seed it!
      if (!user) {
        const hashedPassword = await hashPassword('password123');
        if (demoRole === 'investor') {
          user = await User.create({
            name: 'Marcus Vance',
            email: 'investor@invexa.com',
            password: hashedPassword,
            role: 'investor',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          });

          await InvestorProfile.create({
            userId: user._id,
            fullName: 'Marcus Vance',
            firmName: 'Horizon Capital Ventures',
            title: 'General Partner',
            bio: 'Lead partner investing across Seed to Series A in enterprise SaaS, developer tooling, and foundational AI models.',
            industries: ['AI / ML', 'Enterprise SaaS', 'Cloud Infra', 'FinTech'],
            minInvestment: 250000,
            maxInvestment: 2000000,
            preferredStages: ['Seed', 'Early Stage', 'Growth'],
            location: 'San Francisco, CA',
            website: 'https://horizoncap.vc',
            linkedinUrl: 'https://linkedin.com/in/marcus-vance-invexa',
            completionPercentage: 90,
          });

          await InvestorAvailability.create({
            investorId: user._id,
            slotDurationMinutes: 30,
            weeklySchedule: [
              {
                dayOfWeek: 1,
                dayName: 'Monday',
                isAvailable: true,
                slots: [
                  { startTime: '10:00 AM', endTime: '10:30 AM' },
                  { startTime: '11:00 AM', endTime: '11:30 AM' },
                  { startTime: '02:00 PM', endTime: '02:30 PM' },
                ],
              },
              {
                dayOfWeek: 2,
                dayName: 'Tuesday',
                isAvailable: true,
                slots: [
                  { startTime: '09:00 AM', endTime: '09:30 AM' },
                  { startTime: '03:00 PM', endTime: '03:30 PM' },
                ],
              },
              {
                dayOfWeek: 3,
                dayName: 'Wednesday',
                isAvailable: true,
                slots: [
                  { startTime: '01:00 PM', endTime: '01:30 PM' },
                  { startTime: '02:00 PM', endTime: '02:30 PM' },
                  { startTime: '04:00 PM', endTime: '04:30 PM' },
                ],
              },
              {
                dayOfWeek: 4,
                dayName: 'Thursday',
                isAvailable: true,
                slots: [
                  { startTime: '10:00 AM', endTime: '10:30 AM' },
                  { startTime: '03:30 PM', endTime: '04:00 PM' },
                ],
              },
              {
                dayOfWeek: 5,
                dayName: 'Friday',
                isAvailable: true,
                slots: [
                  { startTime: '09:30 AM', endTime: '10:00 AM' },
                  { startTime: '11:30 AM', endTime: '12:00 PM' },
                ],
              },
            ],
          });
        } else {
          user = await User.create({
            name: 'Alex Rivera',
            email: 'founder@invexa.com',
            password: hashedPassword,
            role: 'startup',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          });

          await StartupProfile.create({
            userId: user._id,
            companyName: 'NeuralPulse AI',
            tagline: 'Distributed inference acceleration for enterprise LLMs',
            description:
              'NeuralPulse builds proprietary software kernels that cut LLM serving latencies by 4x and compute hardware cost by 64%. Currently live with 18 enterprise design partners.',
            industry: 'AI / ML',
            stage: 'Early Stage',
            foundingYear: 2024,
            location: 'San Francisco, CA',
            website: 'https://neuralpulse.ai',
            fundingRequired: 1500000,
            preferredInvestmentType: 'Equity',
            completionPercentage: 92,
            pitchDeckUrl: '/sample-decks/neuralpulse-pitch-deck.pdf',
          });
        }
      }

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
        message: 'Logged in successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        redirectUrl,
      });

      response.cookies.set({
        name: TOKEN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // Standard credential login
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide both email and password' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      '+password'
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

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
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectUrl,
    });

    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error during login' },
      { status: 500 }
    );
  }
}

