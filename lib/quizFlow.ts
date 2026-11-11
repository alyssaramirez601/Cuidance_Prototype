import { AREA_ORDER, quizQuestions } from '@/data/quiz';
import type { QuizSection } from '@/data/quiz';

export type SavedAnswers = Record<string, string[]>;

// Care areas someone will answer, in the fixed order. "I’m not sure yet" on U1 clears the other
// choices, so those people get the one area they pick on N2 (or none, for Browse education)
export function pickedAreas(answers: SavedAnswers): QuizSection[] {
  const fromU1 = answers.q1_areas ?? [];
  const fromN2 = answers.n2_start ?? [];
  const picked = fromU1.includes('not_sure') ? fromN2 : fromU1;
  return AREA_ORDER.filter((area) => picked.includes(area));
}

// The questions this person sees, in order, based on what they have answered so far
export function visibleQuestionIds(answers: SavedAnswers): string[] {
  const notSure = (answers.q1_areas ?? []).includes('not_sure');
  const areas = pickedAreas(answers);
  return quizQuestions
    .filter(
      (question) =>
        question.section === 'start' ||
        (question.section === 'not_sure' && notSure) ||
        areas.includes(question.section),
    )
    .map((question) => question.id);
}

// null means the quiz is finished
export function nextQuestionId(currentId: string, answers: SavedAnswers): string | null {
  const ids = visibleQuestionIds(answers);
  const index = ids.indexOf(currentId);
  return index === -1 ? null : (ids[index + 1] ?? null);
}
