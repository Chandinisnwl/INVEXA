import mongoose from 'mongoose';

const StartupProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: 'FinTech',
    },
    stage: {
      type: String,
      enum: ['Idea', 'MVP', 'Early Stage', 'Growth'],
      default: 'Early Stage',
    },
    foundingYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    location: {
      type: String,
      default: 'San Francisco, CA',
    },
    website: {
      type: String,
      default: '',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    pitchDeckUrl: {
      type: String,
      default: '',
    },
    fundingRequired: {
      type: Number,
      default: 500000,
    },
    preferredInvestmentType: {
      type: String,
      enum: ['SAFE', 'Equity', 'Convertible Note', 'Grant', 'Debt'],
      default: 'Equity',
    },
    socialLinks: {
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    teamMembers: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        bio: { type: String, default: '' },
        avatar: { type: String, default: '' },
      },
    ],
    completionPercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.StartupProfile ||
  mongoose.model('StartupProfile', StartupProfileSchema);

