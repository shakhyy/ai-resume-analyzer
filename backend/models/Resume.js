import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalName: String,
    filePath: String,
    jobRole: String,
    rawText: String,
    parsed: {
      name: String,
      email: String,
      phone: String,
      skills: [String],
      education: [String],
      experience: [String]
    },
    analysis: {
      atsScore: Number,
      scoreBreakdown: {
        keywords: Number,
        skills: Number,
        experience: Number,
        formatting: Number
      },
      missingSkills: [String],
      suggestions: [String],
      weakSections: [String],
      jobMatchPercentage: Number,
      improvedResume: String
    }
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
