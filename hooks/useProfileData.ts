import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { profileCopy } from '@/data/profileCopy';
import { loadProfile, type Profile } from '@/lib/profile';
import { loadAllAnswers } from '@/lib/quizAnswers';
import type { SavedAnswers } from '@/lib/quizFlow';
import { listSavedResults, type SavedResult } from '@/lib/savedResults';

export type ProfileData = { profile: Profile; answers: SavedAnswers; saved: SavedResult[] };

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; data: ProfileData };

// Everything the Profile pages show. Reloads on focus, so a retaken quiz or a new save shows up
export function useProfileData(userId: string) {
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async () => {
    const [profile, answers, saved] = await Promise.all([
      loadProfile(userId),
      loadAllAnswers(userId),
      listSavedResults(userId),
    ]);
    if (!profile.ok || !answers.ok || !saved.ok) {
      setState({ status: 'error', message: profileCopy.loadError });
      return;
    }
    setState({ status: 'ready', data: { profile: profile.profile, answers: answers.answers, saved: saved.results } });
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    load();
  }, [load]);

  return { state, retry };
}
