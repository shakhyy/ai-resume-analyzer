export type ResumeAnalysis = {
  _id: string;
  originalName: string;
  jobRole: string;
  createdAt: string;
  parsed: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    education: string[];
    experience: string[];
  };
  analysis: {
    atsScore: number;
    scoreBreakdown: {
      keywords: number;
      skills: number;
      experience: number;
      formatting: number;
    };
    missingSkills: string[];
    suggestions: string[];
    weakSections: string[];
    jobMatchPercentage: number;
    improvedResume?: string;
  };
};

export type HistoryItem = Pick<ResumeAnalysis, '_id' | 'originalName' | 'jobRole' | 'createdAt'> & {
  parsed?: { name?: string };
  analysis: {
    atsScore: number;
    jobMatchPercentage: number;
  };
};
