import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { listSubmissions, type Submission } from '@/lib/submissions';

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; submissions: Submission[] };

// Products this person added by hand. Reloads on focus, so a product added from Scan shows right away
export function useSubmissions(userId: string) {
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async () => {
    const result = await listSubmissions(userId);
    setState(result.ok ? { status: 'ready', submissions: result.submissions } : { status: 'error', message: result.message });
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return {
    state,
    retry: () => {
      setState({ status: 'loading' });
      load();
    },
  };
}
