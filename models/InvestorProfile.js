import mongoose from 'mongoose';

const InvestorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    firmName: {
      type: String,
      default: 'Independent Angel',
      trim: true,
    },
    title: {
      type: String,
      default: 'Partner / Investor',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    industries: {
      type: [String],
      default: ['SaaS', 'AI / ML', 'FinTech'],
    },
    minInvestment: {
      type: Number,
      default: 50000,
    },
    maxInvestment: {
      type: Number,
      default: 1000000,
    },
    preferredStages: {
      type: [String],
      default: ['Pre-Seed', 'Seed', 'Early Stage'],
    },
    location: {
      type: String,
      default: 'New York, NY',
    },
    website: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    portfolioCompanies: [
      {
        name: { type: String, required: true },
        sector: { type: String, default: '' },
        website: { type: String, default: '' },
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

export default mongoose.models.InvestorProfile ||
  mongoose.model('InvestorProfile', InvestorProfileSchema);

