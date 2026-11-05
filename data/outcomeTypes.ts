import type { QuizSection } from '@/data/quiz';

export type CareArea = Exclude<QuizSection, 'start' | 'not_sure'>;
export type Evidence = 'Strong' | 'Moderate' | 'Limited' | 'Assumption';

// One answer card from docs/quiz-outcomes/. Product cards describe what the result shows instead of advice
export type AnswerCard = {
  code: string;
  area: CareArea;
  questionId: string;
  optionId: string;
  evidence?: Evidence;
  whatItMayMean?: string;
  thingsToTry?: string[];
  ingredients?: string[];
  watchOutFor?: string;
  appSays?: string;
  everySkinTone?: string;
  resultShows?: string;
  explainer?: string;
};

export type AnswerRef = { questionId: string; optionId: string };

export type MixingRule = {
  code: string;
  area: CareArea;
  // A skin care answer that changes makeup or body care advice
  crossArea: boolean;
  title: string;
  // Every group must have at least one of its answers picked for the rule to apply
  conditions: AnswerRef[][];
  whatChanges: string;
  whichWins: string;
  appSays: string;
};

export type ResultName = { headline: string; subtitle: string };

export type SourceGroup = { publisher: string; sources: { title: string; url: string }[] };
