import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { listUserProducts, updateUserProduct, type UserProduct } from '@/lib/userProducts';

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; items: UserProduct[] };

// Saved and owned products. Reloads on focus, so saving on a product page shows up in Saved
export function useUserProducts(userId: string) {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    const result = await listUserProducts(userId);
    setState(result.ok ? { status: 'ready', items: result.items } : { status: 'error', message: result.message });
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const find = useCallback(
    (productId: string) => (state.status === 'ready' ? state.items.find((i) => i.productId === productId) : undefined),
    [state],
  );

  const update = useCallback(
    async (productId: string, change: Partial<Pick<UserProduct, 'saved' | 'owned' | 'reflection'>>) => {
      setActionError('');
      const result = await updateUserProduct(userId, productId, change, find(productId));
      if (!result.ok) {
        setActionError(result.message);
        return false;
      }
      await load();
      return true;
    },
    [userId, find, load],
  );

  return {
    state,
    find,
    update,
    actionError,
    retry: () => {
      setState({ status: 'loading' });
      load();
    },
  };
}
