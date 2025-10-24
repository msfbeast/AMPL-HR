export interface ScorecardItem {
  competency: string;
  questions: string[];
  scoringRubric: {
    weak: string;
    average: string;
    strong: string;
  };
}

export interface EmailTemplates {
  nextSteps: string;
  rejection: string;
}

export interface OnboardingPlan {
  day30: string;
  day60: string;
  day90: string;
}

export interface HiringKit {
  jobDescription: string;
  interviewScorecard: ScorecardItem[];
  emailTemplates: EmailTemplates;
  onboardingPlan?: OnboardingPlan;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface CompetencyMatch {
  competency: string;
  match: string; // e.g., "Strong Match", "Good Match", "Potential Gap"
  evidence: string;
}

export interface ResumeAnalysis {
  summary: string;
  competencyMatches: CompetencyMatch[];
  suggestedQuestions: string[];
}
