import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoadError } from '@/components/LoadError';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { layout, radius, space, stroke, type } from '@/constants/tokens';
import { type Palette, makeStyles, useColors } from '@/hooks/useTheme';
import { profileArt, yourProductsCopy } from '@/data/profileCopy';
import { useAuth } from '@/hooks/useAuth';
import { useSubmissions } from '@/hooks/useSubmissions';
import { shortDate } from '@/lib/profile';
import type { SubmissionStatus } from '@/lib/submissions';

// Each status gets its own words as well as its own color, so color is never the only signal
const STATUS_STYLE = (c: Palette): Record<SubmissionStatus, { ink: string; surface: string }> => ({
  pending: { ink: c.alert, surface: c.alertSurface },
  approved: { ink: c.success, surface: c.successSurface },
  declined: { ink: c.inkMuted, surface: c.disabledSurface },
});

// Products this person added by hand from Scan, and where each one is in the Admin Web review
export default function YourProductsScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={yourProductsCopy.loading} />;
  return <YourProductsContent userId={session.user.id} />;
}

function YourProductsContent({ userId }: { userId: string }) {
  const c = useColors();
  const styles = useStyles();
  const router = useRouter();
  const { state, retry } = useSubmissions(userId);

  if (state.status === 'loading') return <LoadingState label={yourProductsCopy.loading} />;

  return (
    <Screen>
      <PageHeader title={yourProductsCopy.title} intro={yourProductsCopy.intro} art={profileArt.products} />

      {state.status === 'error' ? <LoadError message={state.message} onRetry={retry} /> : null}

      {state.status === 'ready' && state.submissions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{yourProductsCopy.emptyTitle}</Text>
          <Text style={styles.muted}>{yourProductsCopy.emptyBody}</Text>
          <Button label={yourProductsCopy.scan} onPress={() => router.push('/explore/scan')} />
        </View>
      ) : null}

      {state.status === 'ready' && state.submissions.length > 0 ? (
        <View style={styles.list}>
          {state.submissions.map((item) => {
            const look = STATUS_STYLE(c)[item.status];
            return (
              <View key={item.id} style={styles.card}>
                <Text style={styles.name}>{item.productName}</Text>
                <Text style={styles.muted}>
                  {item.brand} · {yourProductsCopy.added(shortDate(item.createdAt))}
                </Text>
                <View style={[styles.status, { backgroundColor: look.surface, borderColor: look.ink }]}>
                  <Text style={[styles.statusText, { color: look.ink }]}>{yourProductsCopy.status[item.status]}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  empty: {
    gap: space[12],
  },
  emptyTitle: {
    ...type.title,
    color: c.ink,
  },
  muted: {
    ...type.caption,
    color: c.inkMuted,
  },
  list: {
    gap: space[12],
  },
  card: {
    gap: space[4],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  name: {
    ...type.label,
    color: c.ink,
  },
  status: {
    alignSelf: 'flex-start',
    marginTop: space[4],
    paddingVertical: space[4],
    paddingHorizontal: space[8],
    borderRadius: radius.small,
    borderWidth: stroke.default,
  },
  statusText: {
    ...type.caption,
  },
}));
