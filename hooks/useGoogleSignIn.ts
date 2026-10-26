import { useState } from 'react';

import { signInWithGoogle } from '@/lib/auth';

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
