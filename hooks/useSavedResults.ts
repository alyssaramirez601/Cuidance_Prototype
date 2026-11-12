import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { listSavedResults, type SavedResult } from '@/lib/savedResults';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; results: SavedResult[] };

// Reloads whenever the screen comes back into view, so a result saved a moment ago shows up
export function useSavedResults(userId: string) {
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async () => {
    const loaded = await listSavedResults(userId);
    setState(loaded.ok ? { status: 'ready', results: loaded.results } : { status: 'error', message: loaded.message });
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { state, retry: () => {
    setState({ status: 'loading' });
    load();
  } };
}
