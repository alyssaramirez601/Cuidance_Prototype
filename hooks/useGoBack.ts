import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useAuth } from '@/hooks/useAuth';

// Back with nothing behind it (for example when Expo Go reopens on this screen) would throw GO_BACK,
// so it goes to the welcome screen when signed out, and the proof screen when signed in
export function useGoBack() {
  const router = useRouter();
  const { session } = useAuth();

  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(session ? '/proof' : '/');
    }
  }, [router, session]);
}
