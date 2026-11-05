import type { ResultName } from '@/data/outcomeTypes';
import type { SavedAnswers } from '@/lib/quizFlow';
import { supabase } from '@/lib/supabase';

export type ActionResult = { ok: true } | { ok: false; message: string };

// Bump this whenever docs/quiz-outcomes changes, so saved results say which library built them
export const CONTENT_VERSION = 'outcomes-2026-11-05';

const SAVE_ERROR = 'We couldn’t save your result. Check your connection and try again.';
const START_OVER_ERROR = 'We couldn’t clear your answers. Check your connection and try again.';

// Only the name and a copy of the answers are stored; the result is rebuilt from them later
export async function saveResult(userId: string, name: ResultName, answers: SavedAnswers): Promise<ActionResult> {
  const { error } = await supabase.from('saved_results').insert({
    user_id: userId,
    result_name: name.headline,
    result_subtitle: name.subtitle,
    answers_snapshot: answers,
    content_version: CONTENT_VERSION,
  });
  return error ? { ok: false, message: SAVE_ERROR } : { ok: true };
}

// "Start over" clears the current answers. Saved results keep their own copy, so history stays true
export async function clearAnswers(userId: string): Promise<ActionResult> {
  const { error } = await supabase.from('quiz_answers').delete().eq('user_id', userId);
  if (error) return { ok: false, message: START_OVER_ERROR };
  await supabase.from('profiles').update({ quiz_completed_at: null }).eq('id', userId);
  return { ok: true };
}

// Home uses this to decide whether to show "Pick up where you left off". Not critical, so a failure is ignored
export async function markQuizComplete(userId: string): Promise<void> {
  await supabase.from('profiles').update({ quiz_completed_at: new Date().toISOString() }).eq('id', userId);
}
