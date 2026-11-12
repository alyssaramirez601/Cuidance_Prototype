import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { colors, radius, space, type } from '@/constants/tokens';
import { savedCopy } from '@/data/draftCopy';
import { useAuth } from '@/hooks/useAuth';
import { buildResult } from '@/lib/buildResult';
import { getSavedResult, type SavedResult } from '@/lib/savedResults';
import { ResultView } from '@/app/quiz/result';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'missing' }
  | { status: 'ready'; saved: SavedResult };

function stateFrom(loaded: Awaited<ReturnType<typeof getSavedResult>>): State {
  if (!loaded.ok) return { status: 'error', message: loaded.message };
  if (!loaded.result) return { status: 'missing' };
  return { status: 'ready', saved: loaded.result };
}

// A saved result, rebuilt from the answers it was saved with, so it reads the way it did that day
export default function SavedResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: 'loading' });
  const backToSaved = useCallback(() => router.navigate('/saved'), [router]);

  const load = useCallback(() => getSavedResult(id).then(stateFrom), [id]);

  useEffect(() => {
    // Ignores a reply that lands after leaving the screen
    let active = true;
    load().then((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
    };
  }, [load]);

  if (!session || state.status === 'loading') {
    return <LoadingState label={savedCopy.loading} />;
  }
  if (state.status === 'error') {
    return (
      <Screen centered>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{state.message}</Text>
          <Button
            label="Try again"
            style="secondary"
            onPress={() => {
              setState({ status: 'loading' });
              load().then(setState);
            }}
          />
        </View>
      </Screen>
    );
  }
  if (state.status === 'missing') {
    return (
      <Screen centered>
        <Text style={styles.title} accessibilityRole="header">
          {savedCopy.notFoundTitle}
        </Text>
        <Text style={styles.body}>{savedCopy.notFoundBody}</Text>
        <Button label={savedCopy.backToSaved} onPress={backToSaved} />
      </Screen>
    );
  }
  return (
    <ResultView
      userId={session.user.id}
      result={buildResult(state.saved.answers)}
      answers={state.saved.answers}
      savedMode={{ onBack: backToSaved }}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    ...type.heading,
    color: colors.light.ink,
  },
  body: {
    ...type.body,
    color: colors.light.inkMuted,
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
});
