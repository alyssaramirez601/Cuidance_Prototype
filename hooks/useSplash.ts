import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import type { SplashVariant } from '@/components/AppSplash';

// The full splash plays on the first open of each day, and the quick one on every open after that
// (Alyssa, Nov 20). Only people who are already signed in when the app opens see either one.
const STORAGE_KEY = 'cuidance.splash.lastFullDay';

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function useSplash(isLoading: boolean, signedIn: boolean) {
  const [state, setState] = useState<'pending' | 'show' | 'done'>('pending');
  const [variant, setVariant] = useState<SplashVariant>('quick');

  useEffect(() => {
    if (isLoading || state !== 'pending') return;
    if (!signedIn) {
      setState('done');
      return;
    }
    const day = today();
    AsyncStorage.getItem(STORAGE_KEY)
      .then((last) => {
        if (last !== day) {
          setVariant('full');
          AsyncStorage.setItem(STORAGE_KEY, day).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setState('show'));
  }, [isLoading, signedIn, state]);

  return { showSplash: state === 'show', variant, finishSplash: () => setState('done') };
}
