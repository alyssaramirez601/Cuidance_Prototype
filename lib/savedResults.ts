import type { SavedAnswers } from '@/lib/quizFlow';
import { supabase } from '@/lib/supabase';

export type SavedResult = {
  id: string;
  name: string;
  subtitle: string;
  savedAt: string;
  answers: SavedAnswers;
};

export type SavedResultsLoad = { ok: true; results: SavedResult[] } | { ok: false; message: string };
export type SavedResultLoad = { ok: true; result: SavedResult | null } | { ok: false; message: string };

const LOAD_ERROR = 'We couldn’t load your saved guidance. Check your connection and try again.';

type Row = {
  id: string;
  result_name: string | null;
  result_subtitle: string | null;
  answers_snapshot: unknown;
  created_at: string;
};

function toSavedResult(row: Row): SavedResult {
  const snapshot = (row.answers_snapshot ?? {}) as Record<string, unknown>;
  const answers: SavedAnswers = {};
  for (const [questionId, value] of Object.entries(snapshot)) {
    answers[questionId] = Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  }
  return {
    id: row.id,
    name: row.result_name ?? '',
    subtitle: row.result_subtitle ?? '',
    savedAt: row.created_at,
    answers,
  };
}

const COLUMNS = 'id, result_name, result_subtitle, answers_snapshot, created_at';

// Newest first, so the latest save is on top in Saved and on Home
export async function listSavedResults(userId: string): Promise<SavedResultsLoad> {
  const { data, error } = await supabase
    .from('saved_results')
    .select(COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    return { ok: false, message: LOAD_ERROR };
  }
  return { ok: true, results: (data ?? []).map((row) => toSavedResult(row as Row)) };
}

// null means it doesn't exist or isn't this person's (row-level security hides other people's)
export async function getSavedResult(id: string): Promise<SavedResultLoad> {
  const { data, error } = await supabase.from('saved_results').select(COLUMNS).eq('id', id).maybeSingle();
  if (error) {
    return { ok: false, message: LOAD_ERROR };
  }
  return { ok: true, result: data ? toSavedResult(data as Row) : null };
}

// "Saved Oct 13" style date for the list
export function savedDateLabel(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
