import mongoose from 'mongoose';

const InvestorAvailabilitySchema = new mongoose.Schema(
  {
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    slotDurationMinutes: {
      type: Number,
      default: 30,
    },
    timezone: {
      type: String,
      default: 'America/New_York',
    },
    weeklySchedule: [
      {
        dayOfWeek: {
          type: Number, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
          required: true,
        },
        dayName: {
          type: String,
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
        slots: [
          {
            startTime: String, // e.g. "09:00"
            endTime: String,   // e.g. "09:30"
          },
        ],
      },
    ],
    blockedDates: [
      {
        date: String, // YYYY-MM-DD
        reason: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.InvestorAvailability ||
  mongoose.model('InvestorAvailability', InvestorAvailabilitySchema);

