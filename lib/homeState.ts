import type { QuizSection } from '@/data/quiz';
import { pickedAreas, visibleQuestionIds, type SavedAnswers } from '@/lib/quizFlow';
import type { SavedResult } from '@/lib/savedResults';

// What Home shows in its feature card and its "Pick up where you left off" band (Home v2, Nov 25).
// The rules are the ones the Home cards already used before v2; only where they show changed:
// - an unfinished quiz offers "Continue guidance" on the next question
// - the newest saved result opens that saved result
// - with no saved result and no question left, "Get your guidance" opens the next question or the first
// - "Your attributes" is always one tap away

export type HomeData = {
  questionsLeft: number;
  nextQuestionId: string | null;
  latest: SavedResult | null;
  answers: SavedAnswers;
};

export type FeatureSlot =
  | { kind: 'result'; result: SavedResult; area: QuizSection | null }
  | { kind: 'quiz'; questionsLeft: number; nextQuestionId: string }
  | { kind: 'start'; questionId: string };

export type ContinueSlot =
  // The quiz is unfinished, but the feature card is already showing a saved result
  | { kind: 'quiz'; questionsLeft: number; nextQuestionId: string }
  // Nothing else to resume: the band leads to the person's attributes
  | { kind: 'attributes' };

export type HomeState = { feature: FeatureSlot; continueSlot: ContinueSlot };

export function homeDataFrom(answers: SavedAnswers, saved: SavedResult[]): HomeData {
  const remaining = visibleQuestionIds(answers).filter((id) => !(id in answers));
  return { questionsLeft: remaining.length, nextQuestionId: remaining[0] ?? null, latest: saved[0] ?? null, answers };
}

export function homeState(data: HomeData): HomeState {
  const unfinished =
    data.questionsLeft > 0 && data.nextQuestionId
      ? { kind: 'quiz' as const, questionsLeft: data.questionsLeft, nextQuestionId: data.nextQuestionId }
      : null;

  if (data.latest) {
    return {
      // The art follows the first care area the result was built from, so a saved result keeps its look
      feature: { kind: 'result', result: data.latest, area: pickedAreas(data.latest.answers)[0] ?? null },
      continueSlot: unfinished ?? { kind: 'attributes' },
    };
  }
  if (unfinished) {
    return { feature: unfinished, continueSlot: { kind: 'attributes' } };
  }
  return { feature: { kind: 'start', questionId: data.nextQuestionId ?? 'q1_areas' }, continueSlot: { kind: 'attributes' } };
}
