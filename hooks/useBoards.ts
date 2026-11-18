import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { listBoards, type Board } from '@/lib/boards';

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; boards: Board[] };

// Every board with its pins. Reloads on focus, so a pin added on a product page shows up in Saved
export function useBoards(userId: string) {
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async () => {
    const result = await listBoards(userId);
    setState(result.ok ? { status: 'ready', boards: result.boards } : { status: 'error', message: result.message });
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return {
    state,
    reload: load,
    retry: () => {
      setState({ status: 'loading' });
      load();
    },
  };
}
