import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ComingNext } from '@/components/ComingNext';
import { Screen } from '@/components/Screen';
import { colors, space, type } from '@/constants/tokens';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';

// Temporary until Profile is built (Week 11 build order, part 3). Sign out lives here meanwhile
export default function ProfileScreen() {
  const { session } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');

  async function handleSignOut() {
    setError('');
    setIsSigningOut(true);
    const result = await signOut();
    setIsSigningOut(false);
    if (!result.ok) setError(result.message);
  }

  return (
    <Screen>
      <ComingNext title="Profile" body="Your attributes, guidance history, privacy and account settings are being built next." />
      <View style={styles.account}>
        <Text style={styles.signedInAs}>Signed in as {session?.user.email ?? ''}</Text>
        {error ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {error}
          </Text>
        ) : null}
        <Button label={isSigningOut ? 'Signing out' : 'Sign out'} style="secondary" loading={isSigningOut} onPress={handleSignOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  account: {
    gap: space[12],
  },
  signedInAs: {
    ...type.body,
    color: colors.light.ink,
  },
  error: {
    ...type.body,
    color: colors.light.error,
  },
});
