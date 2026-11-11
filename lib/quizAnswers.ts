import { supabase } from '@/lib/supabase';

export type LoadResult = { ok: true; optionIds: string[] } | { ok: false; message: string };
export type AllAnswersResult = { ok: true; answers: Record<string, string[]> } | { ok: false; message: string };
export type SaveResult = { ok: true } | { ok: false; message: string };

const LOAD_ERROR = 'We couldn’t load your saved answer. Please try again.';
const LOAD_ALL_ERROR = 'We couldn’t load your answers. Please try again.';
const SAVE_ERROR = 'We couldn’t save that. Check your connection and try again.';

export async function loadAnswer(userId: string, questionId: string): Promise<LoadResult> {
  const { data, error } = await supabase
    .from('quiz_answers')
    .select('answer')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .maybeSingle();
  if (error) {
    return { ok: false, message: LOAD_ERROR };
  }
  const answer = data?.answer;
  const optionIds = Array.isArray(answer) ? answer.filter((id): id is string => typeof id === 'string') : [];
  return { ok: true, optionIds };
}

// An empty selection removes the row, so "not answered yet" stays different from "skipped"
export async function saveAnswer(userId: string, questionId: string, optionIds: string[]): Promise<SaveResult> {
  if (optionIds.length === 0) {
    const { error } = await supabase
      .from('quiz_answers')
      .delete()
      .eq('user_id', userId)
      .eq('question_id', questionId);
    return error ? { ok: false, message: SAVE_ERROR } : { ok: true };
  }
  const { error } = await supabase
    .from('quiz_answers')
    .upsert(
      { user_id: userId, question_id: questionId, answer: optionIds, skipped: false },
      { onConflict: 'user_id,question_id' },
    );
  return error ? { ok: false, message: SAVE_ERROR } : { ok: true };
}

// Every current answer, keyed by question id. Skipped questions come back as an empty list
export async function loadAllAnswers(userId: string): Promise<AllAnswersResult> {
  const { data, error } = await supabase.from('quiz_answers').select('question_id, answer').eq('user_id', userId);
  if (error) {
    return { ok: false, message: LOAD_ALL_ERROR };
  }
  const answers: Record<string, string[]> = {};
  for (const row of data ?? []) {
    const answer = row.answer;
    answers[row.question_id] = Array.isArray(answer) ? answer.filter((id): id is string => typeof id === 'string') : [];
  }
  return { ok: true, answers };
}

// Moving past an optional question with nothing picked. Skipped stays unknown, never guessed
export async function skipAnswer(userId: string, questionId: string): Promise<SaveResult> {
  const { error } = await supabase
    .from('quiz_answers')
    .upsert(
      { user_id: userId, question_id: questionId, answer: null, skipped: true },
      { onConflict: 'user_id,question_id' },
    );
  return error ? { ok: false, message: SAVE_ERROR } : { ok: true };
}
