import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoadingState } from '@/components/LoadingState';
import { OptionRow } from '@/components/OptionRow';
import { Screen } from '@/components/Screen';
import { colors, radius, space, stroke, type } from '@/constants/tokens';
import { q1Areas } from '@/data/quiz';
import { useAuth } from '@/hooks/useAuth';
import { useQuizAnswer } from '@/hooks/useQuizAnswer';
import { signOut } from '@/lib/auth';

// Temporary test screen that proves sign-in and saving work. The real quiz screens replace it.
export default function ProofScreen() {
  const { session } = useAuth();
  if (!session) {
    return <LoadingState label="Loading your account" />;
  }
  return <ProofQuestion userId={session.user.id} email={session.user.email ?? ''} />;
}

type ProofQuestionProps = {
  userId: string;
  email: string;
};

function ProofQuestion({ userId, email }: ProofQuestionProps) {
  const { selected, status, message, toggle, retry } = useQuizAnswer(userId, q1Areas);
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

  if (status === 'loading') {
    return <LoadingState label="Loading your answers" />;
  }

  return (
    <Screen>
      <Text style={styles.testNote}>Test screen: the real quiz comes next.</Text>

      <View style={styles.header}>
        <Text style={styles.prompt} accessibilityRole="header">
          {q1Areas.prompt}
        </Text>
        <Text style={styles.helper}>{q1Areas.helper}</Text>
      </View>

      <View style={styles.options}>
        {q1Areas.options.map((option) => (
          <OptionRow
            key={option.id}
            label={option.label}
            selected={selected.includes(option.id)}
            onPress={() => toggle(option.id)}
          />
        ))}
      </View>

      <Text style={styles.note}>{q1Areas.note}</Text>

      <View accessibilityLiveRegion="polite" style={styles.statusArea}>
        {status === 'saving' ? <Text style={styles.statusText}>Saving</Text> : null}
        {status === 'saved' ? (
          <View style={styles.savedChip}>
            <Text style={styles.savedText}>✓ Saved</Text>
          </View>
        ) : null}
        {status === 'error' ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{message}</Text>
            <Button label="Try again" variant="secondary" onPress={retry} />
          </View>
        ) : null}
      </View>

      <View style={styles.account}>
        <Text style={styles.signedInAs}>Signed in as {email}</Text>
        {signOutError ? (
          <Text accessibilityLiveRegion="polite" style={styles.errorText}>
            {signOutError}
          </Text>
        ) : null}
        <Button
          label={isSigningOut ? 'Signing out' : 'Sign out'}
          variant="secondary"
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
  header: {
    gap: space[8],
  },
  prompt: {
    ...type.heading,
    color: colors.light.ink,
  },
  helper: {
    ...type.body,
    color: colors.light.inkMuted,
  },
  options: {
    gap: space[12],
  },
  note: {
    ...type.caption,
    color: colors.light.inkMuted,
  },
  statusArea: {
    minHeight: space[48],
    justifyContent: 'center',
  },
  statusText: {
    ...type.body,
    color: colors.light.inkMuted,
  },
  savedChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: space[16],
    paddingVertical: space[8],
    borderRadius: radius.pill,
    backgroundColor: colors.light.successSurface,
  },
  savedText: {
    ...type.label,
    color: colors.light.ink,
  },
  errorBox: {
    gap: space[12],
    padding: space[16],
    borderRadius: radius.medium,
    backgroundColor: colors.light.errorSurface,
  },
  errorText: {
    ...type.body,
    color: colors.light.error,
  },
  account: {
    gap: space[12],
    marginTop: space[16],
    paddingTop: space[24],
    borderTopWidth: stroke.default,
    borderTopColor: colors.light.border,
  },
  signedInAs: {
    ...type.caption,
    color: colors.light.inkMuted,
  },
});
