import { useState } from 'react';
import { Platform } from 'react-native';

import { signInWithGoogle } from '@/lib/auth';

// Web only for now. In Expo Go, Supabase ignores the exp:// return address and sends the
// in-app browser to the Site URL instead. The native path in lib/auth.ts stays in place so
// we can turn this on again when we test with a development build.
export const isGoogleSignInAvailable = Platform.OS === 'web';

export function useGoogleSignIn() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  async function startGoogleSignIn() {
    setGoogleError('');
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    setIsGoogleLoading(false);
    // On success the sign-in listener moves the person on. Cancelling leaves them where they were
    if (!result.ok) {
      setGoogleError(result.message);
    }
  }

  return { isGoogleLoading, googleError, startGoogleSignIn };
}
