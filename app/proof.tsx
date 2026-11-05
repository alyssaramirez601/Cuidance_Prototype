import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { colors, space, type } from '@/constants/tokens';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';

// Temporary account screen behind "Save and exit" until Home exists. The quiz itself starts right after sign-in
export default function ProofScreen() {
  const { session } = useAuth();
  if (!session) {
    return <LoadingState label="Loading your account" />;
  }
  return <AccountTest email={session.user.email ?? ''} />;
}

function AccountTest({ email }: { email: string }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  async function handleSignOut() {
    setSignOutError('');
    setIsSigningOut(true);
    const result = await signOut();
    setIsSigningOut(false);
    if (!result.ok) {
      setSignOutError(result.message);
    }
  }

  return (
    <Screen>
      <Text style={styles.testNote}>Test screen: Home comes next.</Text>

      {/* TEMPORARY: remove before merging */}
      <Button label="Dev screen" style="secondary" onPress={() => router.push('/dev')} />

      <View style={styles.account}>
        <Text style={styles.signedInAs}>Signed in as {email}</Text>
        {signOutError ? (
          <Text accessibilityLiveRegion="polite" style={styles.errorText}>
            {signOutError}
          </Text>
        ) : null}
        <Button
          label={isSigningOut ? 'Signing out' : 'Sign out'}
          style="secondary"
          onPress={handleSignOut}
          loading={isSigningOut}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  testNote: {
    ...type.caption,
    color: colors.light.inkMuted,
  },
  errorText: {
    ...type.body,
    color: colors.light.error,
  },
  account: {
    gap: space[12],
  },
  signedInAs: {
    ...type.caption,
    color: colors.light.inkMuted,
  },
});
