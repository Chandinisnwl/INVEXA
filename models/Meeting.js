import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    timeSlot: {
      type: String, // e.g. "10:00 AM - 10:30 AM"
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/inv-exap-itch',
    },
    notes: {
      type: String,
      default: '',
    },
    pitchDeckUrl: {
      type: String,
      default: '',
    },
    requestedBy: {
      type: String,
      enum: ['startup', 'investor'],
      default: 'startup',
    },
  },
  {
    timestamps: true,
  }
);

MeetingSchema.index({ investorId: 1, date: 1, timeSlot: 1 });

export default mongoose.models.Meeting || mongoose.model('Meeting', MeetingSchema);

