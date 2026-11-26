import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoadError } from '@/components/LoadError';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { Toast } from '@/components/Toast';
import { layout, radius, space, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';
import { savedCopy } from '@/data/appCopy';
import { useAuth } from '@/hooks/useAuth';
import { useBoards } from '@/hooks/useBoards';
import { useSavedResults } from '@/hooks/useSavedResults';
import { deleteBoard, removePin, type Pin } from '@/lib/boards';
import { pinView, type PinView } from '@/lib/explore';

export default function BoardScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={savedCopy.boardsLoading} />;
  return <BoardContent userId={session.user.id} />;
}

// One board, Pinterest style: pins in two columns, newest first
function BoardContent({ userId }: { userId: string }) {
  const styles = useStyles();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, retry, reload } = useBoards(userId);
  const saved = useSavedResults(userId);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  if (state.status === 'loading') return <LoadingState label={savedCopy.boardsLoading} />;
  if (state.status === 'error') {
    return (
      <Screen>
        <PageHeader title={savedCopy.title} backTo="/saved" />
        <LoadError message={state.message} onRetry={retry} />
      </Screen>
    );
  }
  const board = state.boards.find((b) => b.id === id);
  if (!board) {
    return (
      <Screen>
        <PageHeader title={savedCopy.boardNotFoundTitle} intro={savedCopy.boardNotFoundBody} backTo="/saved" />
        <Button label={savedCopy.backToSaved} onPress={() => router.navigate('/saved')} />
      </Screen>
    );
  }

  const names = saved.state.status === 'ready' ? Object.fromEntries(saved.state.results.map((r) => [r.id, r.name])) : {};
  const pins = board.pins
    .map((pin) => ({ pin, view: pinView(pin.kind, pin.ref, names[pin.ref]) }))
    .filter((p): p is { pin: Pin; view: PinView } => Boolean(p.view));
  // Alternating columns gives the staggered Pinterest look, since pins have different heights
  const columns = [pins.filter((_, i) => i % 2 === 0), pins.filter((_, i) => i % 2 === 1)];

  async function remove(pinId: string) {
    setError('');
    const result = await removePin(pinId);
    if (!result.ok) setError(result.message);
    reload();
  }

  async function removeBoard() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    const result = await deleteBoard(board!.id);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.navigate('/saved');
  }

  return (
    <Screen>
      <PageHeader title={board.name} intro={savedCopy.pinCount(board.pins.length)} backTo="/saved" />
      {error ? <Toast type="error" message={error} /> : null}

      {pins.length === 0 ? (
        <Text style={styles.empty}>{savedCopy.boardEmpty}</Text>
      ) : (
        <View style={styles.columns}>
          {columns.map((column, ci) => (
            <View key={ci} style={styles.column}>
              {column.map(({ pin, view }) => (
                <View key={pin.id} style={styles.pin}>
                  <Pressable
                    onPress={() => router.push(view.href as Href)}
                    accessibilityRole="button"
                    accessibilityLabel={view.title}
                  >
                    <Image
                      source={view.image}
                      style={[styles.pinImage, { aspectRatio: view.square ? 1 : 3 / 4 }]}
                      contentFit="cover"
                      accessible={false}
                    />
                    <Text style={styles.pinTitle} numberOfLines={2}>
                      {view.title || savedCopy.resultPin}
                    </Text>
                    {view.detail ? <Text style={styles.pinDetail}>{view.detail}</Text> : null}
                  </Pressable>
                  <Pressable
                    onPress={() => remove(pin.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${savedCopy.removePin}: ${view.title}`}
                    style={styles.remove}
                  >
                    <Text style={styles.removeText}>{savedCopy.removePin}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      <Button label={confirming ? savedCopy.confirmDelete : savedCopy.deleteBoard} style="ghost" onPress={removeBoard} />
    </Screen>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  empty: {
    ...type.body,
    color: c.inkMuted,
  },
  columns: {
    flexDirection: 'row',
    gap: space[12],
  },
  column: {
    flex: 1,
    gap: space[16],
  },
  pin: {
    gap: space[4],
  },
  pinImage: {
    width: '100%',
    borderRadius: radius.medium,
    marginBottom: space[4],
    backgroundColor: c.surfaceWarm,
  },
  pinTitle: {
    ...type.label,
    color: c.ink,
  },
  pinDetail: {
    ...type.caption,
    color: c.inkMuted,
  },
  remove: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  removeText: {
    ...type.caption,
    color: c.accent,
  },
}));
