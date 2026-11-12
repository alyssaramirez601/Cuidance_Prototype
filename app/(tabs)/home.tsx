import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { HomeHeader } from '@/components/HomeHeader';
import { Icon } from '@/components/Icon';
import { ListRow } from '@/components/ListRow';
import { LoadingState } from '@/components/LoadingState';
import { PartnerHighlightCard } from '@/components/PartnerHighlightCard';
import { Screen } from '@/components/Screen';
import { colors, layout, letterSpacing, radius, sizes, space, type } from '@/constants/tokens';
import { homeCopy, partnerPlaceholders } from '@/data/draftCopy';
import { useAuth } from '@/hooks/useAuth';
import { firstNameFrom } from '@/lib/auth';
import { loadAllAnswers } from '@/lib/quizAnswers';
import { visibleQuestionIds } from '@/lib/quizFlow';
import { listSavedResults, type SavedResult } from '@/lib/savedResults';

type HomeData = { questionsLeft: number; nextQuestionId: string | null; latest: SavedResult | null };
type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; data: HomeData };

const c = colors.light;

function greetingFor(hour: number): string {
  if (hour < 12) return homeCopy.morning;
  if (hour < 18) return homeCopy.afternoon;
  return homeCopy.evening;
}

export default function HomeScreen() {
  const { session } = useAuth();
  if (!session) {
    return <LoadingState label={homeCopy.loading} />;
  }
  return <HomeContent userId={session.user.id} name={firstNameFrom(session.user.user_metadata)} />;
}

function HomeContent({ userId, name }: { userId: string; name: string }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [partnerFilter, setPartnerFilter] = useState(partnerPlaceholders.filters[1]);

  const load = useCallback(async () => {
    const [answers, saved] = await Promise.all([loadAllAnswers(userId), listSavedResults(userId)]);
    if (!answers.ok || !saved.ok) {
      setState({ status: 'error', message: homeCopy.loadError });
      return;
    }
    const remaining = visibleQuestionIds(answers.answers).filter((id) => !(id in answers.answers));
    setState({
      status: 'ready',
      data: { questionsLeft: remaining.length, nextQuestionId: remaining[0] ?? null, latest: saved.results[0] ?? null },
    });
  }, [userId]);

  // Refreshes when someone comes back to Home, so a new save or answer shows up
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (state.status === 'loading') {
    return <LoadingState label={homeCopy.loading} />;
  }

  return (
    <Screen>
      <View style={styles.headerWrap}>
        <HomeHeader greeting={greetingFor(new Date().getHours())} name={name} onProfilePress={() => router.navigate('/profile')} />
      </View>

      {state.status === 'error' ? (
        <View style={styles.errorBox} accessibilityLiveRegion="polite">
          <Text style={styles.errorText}>{state.message}</Text>
          <Button label="Try again" style="secondary" onPress={load} />
        </View>
      ) : (
        <>
          {/* Only while the quiz isn't finished, like the Week 8 "quiz unfinished" Home */}
          {state.data.questionsLeft > 0 && state.data.nextQuestionId ? (
            <View style={styles.resume}>
              <Text style={styles.eyebrow}>{homeCopy.resumeEyebrow}</Text>
              <Text style={styles.resumeTitle}>{homeCopy.resumeTitle}</Text>
              <Text style={styles.resumeCount}>{homeCopy.questionsLeft(state.data.questionsLeft)}</Text>
              <Button label={homeCopy.resumeButton} onPress={() => router.push(`/quiz/${state.data.nextQuestionId}`)} />
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {homeCopy.updatesTitle}
            </Text>
            {state.data.latest ? (
              <ListRow
                label={`${homeCopy.yourResult}: ${state.data.latest.name}`}
                detail={homeCopy.revisit}
                leading={<IconTile name="saved" tone="success" />}
                onPress={() => router.push(`/saved/${state.data.latest?.id}`)}
              />
            ) : (
              <ListRow
                label={homeCopy.getGuidance}
                detail={homeCopy.getGuidanceDetail}
                leading={<IconTile name="help" tone="warm" />}
                onPress={() => router.push(`/quiz/${state.data.nextQuestionId ?? 'q1_areas'}`)}
              />
            )}
          </View>

          {/* Placeholder partner content until Shop has real partners. Always labeled Partner content */}
          <View style={styles.partners}>
            <Text style={styles.partnersTitle} accessibilityRole="header">
              {partnerPlaceholders.title}
            </Text>
            {/* One row that scrolls sideways, like the design, instead of wrapping */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {partnerPlaceholders.filters.map((filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  state={filter === partnerFilter ? 'selected' : 'default'}
                  onPress={() => setPartnerFilter(filter)}
                />
              ))}
            </ScrollView>
            <View style={styles.cards}>
              {partnerPlaceholders.products.map((product) => (
                <PartnerHighlightCard
                  key={product.name}
                  brand={product.brand}
                  name={product.name}
                  onPress={() => router.navigate('/shop')}
                />
              ))}
            </View>
            <Text style={styles.placeholderNote}>{partnerPlaceholders.note}</Text>
            <ListRow label={partnerPlaceholders.seeAll} onPress={() => router.navigate('/shop')} />
          </View>
        </>
      )}
    </Screen>
  );
}

function IconTile({ name, tone }: { name: 'saved' | 'help'; tone: 'success' | 'warm' }) {
  return (
    <View style={[styles.tile, { backgroundColor: tone === 'success' ? c.successSurface : c.surfaceWarm }]}>
      <Icon name={name} size={sizes.icon.large} color={c.ink} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    marginTop: -space[24],
  },
  section: {
    gap: space[12],
  },
  sectionTitle: {
    ...type.title,
    color: c.ink,
  },
  eyebrow: {
    ...type.caption,
    fontFamily: type.label.fontFamily,
    color: c.highlight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  resume: {
    gap: space[8],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.surfaceWarm,
  },
  resumeTitle: {
    ...type.title,
    color: c.ink,
  },
  resumeCount: {
    ...type.caption,
    color: c.inkMuted,
    marginBottom: space[4],
  },
  tile: {
    width: space[48],
    height: space[48],
    borderRadius: radius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partners: {
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.partnerSurface,
  },
  partnersTitle: {
    ...type.title,
    color: c.ink,
  },
  filters: {
    gap: space[8],
  },
  cards: {
    flexDirection: 'row',
    gap: space[8],
  },
  placeholderNote: {
    ...type.caption,
    color: c.inkMuted,
  },
  errorBox: {
    gap: space[12],
    padding: space[16],
    borderRadius: radius.medium,
    backgroundColor: c.errorSurface,
  },
  errorText: {
    ...type.body,
    color: c.error,
  },
});
