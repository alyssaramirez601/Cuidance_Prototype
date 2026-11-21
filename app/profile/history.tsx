import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoadError } from '@/components/LoadError';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { layout, radius, space, stroke, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';
import { historyCopy, profileArt, profileCopy } from '@/data/profileCopy';
import { useAuth } from '@/hooks/useAuth';
import { useSavedResults } from '@/hooks/useSavedResults';
import type { SavedResult } from '@/lib/savedResults';

function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Prototype screen 22. The newest saved result is the current one; older ones sit below it
export default function HistoryScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={profileCopy.loading} />;
  return <HistoryContent userId={session.user.id} />;
}

function HistoryContent({ userId }: { userId: string }) {
  const styles = useStyles();
  const router = useRouter();
  const { state, retry } = useSavedResults(userId);

  if (state.status === 'loading') return <LoadingState label={profileCopy.loading} />;

  const open = (result: SavedResult) => router.push(`/saved/${result.id}`);

  return (
    <Screen>
      <PageHeader title={historyCopy.title} intro={historyCopy.intro} art={profileArt.history} />

      {state.status === 'error' ? <LoadError message={state.message} onRetry={retry} /> : null}

      {state.status === 'ready' && state.results.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.body}>{historyCopy.empty}</Text>
          <Button label={historyCopy.takeQuiz} onPress={() => router.push('/quiz/q1_areas')} />
        </View>
      ) : null}

      {state.status === 'ready' && state.results.length > 0 ? (
        <>
          <View style={styles.current}>
            <View style={styles.currentHead}>
              <Text style={styles.date}>{longDate(state.results[0].savedAt)}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{historyCopy.current}</Text>
              </View>
            </View>
            <Text style={styles.currentTitle}>{state.results[0].name}</Text>
            {state.results[0].subtitle ? <Text style={styles.body}>{state.results[0].subtitle}</Text> : null}
            <Button label={historyCopy.reopenResult} style="secondary" onPress={() => open(state.results[0])} />
          </View>

          <View style={styles.list}>
            {state.results.slice(1).map((result, index) => (
              <View key={result.id} style={[styles.row, index > 0 && styles.rowDivider]}>
                <View style={styles.rowText}>
                  <Text style={styles.date}>{longDate(result.savedAt)}</Text>
                  <Text style={styles.rowTitle}>{result.name}</Text>
                  {result.subtitle ? <Text style={styles.date}>{result.subtitle}</Text> : null}
                </View>
                <Pressable
                  onPress={() => open(result)}
                  accessibilityRole="button"
                  accessibilityLabel={`${historyCopy.reopen}: ${result.name}`}
                  style={styles.reopen}
                >
                  <Text style={styles.link}>{historyCopy.reopen}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  empty: {
    gap: space[16],
  },
  body: {
    ...type.body,
    color: c.inkMuted,
  },
  current: {
    gap: space[8],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.strong,
    borderColor: c.selected,
    backgroundColor: c.surface,
  },
  currentHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[8],
  },
  badge: {
    paddingHorizontal: space[8],
    paddingVertical: space[4],
    borderRadius: radius.pill,
    backgroundColor: c.selectedSurface,
  },
  badgeText: {
    ...type.caption,
    color: c.selected,
  },
  currentTitle: {
    ...type.title,
    color: c.ink,
  },
  date: {
    ...type.caption,
    color: c.inkMuted,
  },
  list: {
    paddingHorizontal: layout.insideComponent,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: space[12],
  },
  rowDivider: {
    borderTopWidth: stroke.default,
    borderTopColor: c.border,
  },
  rowText: {
    flex: 1,
    gap: space[4],
  },
  rowTitle: {
    ...type.label,
    color: c.ink,
  },
  reopen: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  link: {
    ...type.label,
    color: c.accent,
  },
}));
