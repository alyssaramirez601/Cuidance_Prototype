import { useCallback, useEffect, useState } from 'react';

import type { GuidanceResult } from '@/lib/buildResult';
import { buildResult } from '@/lib/buildResult';
import { loadAllAnswers } from '@/lib/quizAnswers';
import type { SavedAnswers } from '@/lib/quizFlow';
import { markQuizComplete } from '@/lib/results';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; result: GuidanceResult; answers: SavedAnswers };

// Rebuilds the result from the saved answers every time, so it always matches what was picked
export function useGuidanceResult(userId: string) {
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    const loaded = await loadAllAnswers(userId);
    if (!loaded.ok) {
      setState({ status: 'error', message: loaded.message });
      return;
    }
    setState({ status: 'ready', result: buildResult(loaded.answers), answers: loaded.answers });
    markQuizComplete(userId);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { state, retry: load };
}
