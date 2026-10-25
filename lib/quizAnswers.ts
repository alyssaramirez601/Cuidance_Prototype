import { supabase } from '@/lib/supabase';

export type LoadResult = { ok: true; optionIds: string[] } | { ok: false; message: string };
export type SaveResult = { ok: true } | { ok: false; message: string };

const LOAD_ERROR = 'We couldn’t load your saved answer. Please try again.';
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
