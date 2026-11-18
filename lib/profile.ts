import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/lib/supabase';

export type Profile = { displayName: string; quizCompletedAt: string | null };
export type ProfileLoad = { ok: true; profile: Profile } | { ok: false; message: string };
export type ActionResult = { ok: true } | { ok: false; message: string };

const LOAD_ERROR = 'We couldn’t load your profile. Check your connection and try again.';
const SAVE_ERROR = 'We couldn’t save that. Check your connection and try again.';
const RESET_ERROR = 'We couldn’t send the reset link. Wait a minute and try again.';

export async function loadProfile(userId: string): Promise<ProfileLoad> {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, quiz_completed_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) return { ok: false, message: LOAD_ERROR };
  return {
    ok: true,
    profile: { displayName: data?.display_name ?? '', quizCompletedAt: data?.quiz_completed_at ?? null },
  };
}

export async function updateDisplayName(userId: string, name: string): Promise<ActionResult> {
  const { error } = await supabase.from('profiles').update({ display_name: name.trim() }).eq('id', userId);
  return error ? { ok: false, message: SAVE_ERROR } : { ok: true };
}

export async function sendPasswordReset(email: string): Promise<ActionResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return error ? { ok: false, message: RESET_ERROR } : { ok: true };
}

// "Updated Nov 17" style date, matching the Saved list
export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Privacy and notification choices. Kept on this phone for the beta, since nothing reads them yet
// and there's no database column for them. Each person gets their own key
export type SettingsKind = 'privacy' | 'notifications';

const DEFAULTS: Record<SettingsKind, boolean[]> = {
  privacy: [true, true, false],
  notifications: [true, true, false, false],
};

function settingsKey(kind: SettingsKind, userId: string): string {
  return `cuidance.${kind}.${userId}`;
}

export async function loadSettings(kind: SettingsKind, userId: string): Promise<boolean[]> {
  try {
    const raw = await AsyncStorage.getItem(settingsKey(kind, userId));
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length === DEFAULTS[kind].length) {
      return parsed.map(Boolean);
    }
  } catch {
    // A broken or missing value falls back to the defaults below
  }
  return [...DEFAULTS[kind]];
}

export async function saveSettings(kind: SettingsKind, userId: string, values: boolean[]): Promise<ActionResult> {
  try {
    await AsyncStorage.setItem(settingsKey(kind, userId), JSON.stringify(values));
    return { ok: true };
  } catch {
    return { ok: false, message: SAVE_ERROR };
  }
}
