import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState, type ReactNode } from 'react';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { HomeHeader } from '@/components/HomeHeader';
import { Icon } from '@/components/Icon';
import { ListRow } from '@/components/ListRow';
import { LoadingState } from '@/components/LoadingState';
import { PartnerHighlightCard } from '@/components/PartnerHighlightCard';
import { ProductMiniCard } from '@/components/ProductMiniCard';
import { Screen } from '@/components/Screen';
import { colors, layout, letterSpacing, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { homeCopy, partnerPlaceholders } from '@/data/draftCopy';
import { articles } from '@/data/education';
import { productsCopy } from '@/data/exploreCopy';
import { articleArt, productShortLabel, productsFor } from '@/lib/explore';
import { useAuth } from '@/hooks/useAuth';
import { firstNameFrom } from '@/lib/auth';
import { loadAllAnswers } from '@/lib/quizAnswers';
import { pickedAreas, visibleQuestionIds } from '@/lib/quizFlow';
import { listSavedResults, type SavedResult } from '@/lib/savedResults';

type HomeData = { questionsLeft: number; nextQuestionId: string | null; latest: SavedResult | null; answers: Record<string, string[]> };
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
      data: { questionsLeft: remaining.length, nextQuestionId: remaining[0] ?? null, latest: saved.results[0] ?? null, answers: answers.answers },
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

  const forYou = state.status === 'ready' ? productsFor({ areas: pickedAreas(state.data.answers) }).slice(0, 8) : [];

  return (
    <Screen>
      <View style={styles.headerWrap}>
        <HomeHeader greeting={greetingFor(new Date().getHours())} name={name} onProfilePress={() => router.navigate('/profile')} />
      </View>

      {/* Looks like a search field, like Ulta's and Sephora's Home, and opens Explore where search lives */}
      <Pressable
        onPress={() => router.navigate('/explore')}
        accessibilityRole="search"
        accessibilityLabel={homeCopy.searchHint}
        style={styles.search}
      >
        <Icon name="explore" size={sizes.icon.medium} color={c.inkMuted} />
        <Text style={styles.searchText}>{homeCopy.searchHint}</Text>
      </Pressable>

      {state.status === 'error' ? (
        <View style={styles.errorBox} accessibilityLiveRegion="polite">
          <Text style={styles.errorText}>{state.message}</Text>
          <Button label="Try again" style="secondary" onPress={load} />
        </View>
      ) : (
        <>
          <Row title={homeCopy.resumeEyebrow}>
            {state.data.questionsLeft > 0 && state.data.nextQuestionId ? (
              <View style={[styles.pickCard, styles.pickWarm]}>
                <Text style={styles.pickTitle}>{homeCopy.resumeTitle}</Text>
                <Text style={styles.pickMeta}>{homeCopy.questionsLeft(state.data.questionsLeft)}</Text>
                <Button label={homeCopy.resumeButton} onPress={() => router.push(`/quiz/${state.data.nextQuestionId}`)} />
              </View>
            ) : null}
            {state.data.latest ? (
              <PickCard
                icon={<IconTile name="saved" tone="success" />}
                title={`${homeCopy.yourResult}: ${state.data.latest.name}`}
                detail={homeCopy.revisit}
                onPress={() => router.push(`/saved/${state.data.latest?.id}`)}
              />
            ) : state.data.questionsLeft === 0 || !state.data.nextQuestionId ? (
              <PickCard
                icon={<IconTile name="help" tone="warm" />}
                title={homeCopy.getGuidance}
                detail={homeCopy.getGuidanceDetail}
                onPress={() => router.push(`/quiz/${state.data.nextQuestionId ?? 'q1_areas'}`)}
              />
            ) : null}
            <PickCard
              icon={<IconTile name="profile" tone="warm" />}
              title={homeCopy.attributesTitle}
              detail={homeCopy.attributesDetail}
              onPress={() => router.push('/profile/attributes')}
            />
          </Row>

          {forYou.length ? (
            <Row
              title={productsCopy.forYou}
              onSeeAll={() => router.push({ pathname: '/explore/products', params: { forYou: '1' } })}
            >
              {forYou.map((product) => (
                <ProductMiniCard
                  key={product.id}
                  product={product}
                  label={productShortLabel(product)}
                  onPress={() => router.push(`/explore/product/${product.id}`)}
                />
              ))}
            </Row>
          ) : null}

          <Row title={homeCopy.guidesTitle} onSeeAll={() => router.push('/explore/education')}>
            {articles.map((article) => (
              <Pressable
                key={article.id}
                onPress={() => router.push(`/explore/article/${article.id}`)}
                accessibilityRole="button"
                accessibilityLabel={article.title}
                style={styles.guide}
              >
                <Image source={articleArt(article.id)} style={styles.guideArt} contentFit="cover" accessible={false} />
                <Text style={styles.pickMeta}>
                  {article.kind} · {homeCopy.readTime(article.minutes)}
                </Text>
                <Text style={styles.guideTitle} numberOfLines={2}>
                  {article.title}
                </Text>
              </Pressable>
            ))}
          </Row>

          {/* Placeholder partner content until Shop has real partners. Always labeled Partner content */}
          <View style={styles.partners}>
            <Text style={styles.partnersTitle} accessibilityRole="header">
              {partnerPlaceholders.title}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.noGrow} contentContainerStyle={styles.filters}>
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

// A titled row that scrolls sideways, with an optional "See all" link, like the Ulta and Sephora Home
function Row({ title, onSeeAll, children }: { title: string; onSeeAll?: () => void; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.rowHead}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {title}
        </Text>
        {onSeeAll ? (
          <Pressable onPress={onSeeAll} accessibilityRole="link" accessibilityLabel={`${homeCopy.seeAll}: ${title}`} style={styles.seeAll}>
            <Text style={styles.link}>{homeCopy.seeAll}</Text>
          </Pressable>
        ) : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.rowContent}>
        {children}
      </ScrollView>
    </View>
  );
}

function PickCard({ icon, title, detail, onPress }: { icon: ReactNode; title: string; detail: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title} style={styles.pickCard}>
      {icon}
      <Text style={styles.pickTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.pickMeta}>{detail}</Text>
    </Pressable>
  );
}

function IconTile({ name, tone }: { name: 'saved' | 'help' | 'profile'; tone: 'success' | 'warm' }) {
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
  search: {
    minHeight: layout.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
    paddingHorizontal: space[16],
    borderRadius: radius.pill,
    borderWidth: stroke.default,
    borderColor: c.borderStrong,
    backgroundColor: c.surface,
  },
  searchText: {
    ...type.body,
    color: c.inkMuted,
  },
  rowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAll: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  link: {
    ...type.label,
    color: c.accent,
  },
  // A sideways row inside the page scroll grows to fill the screen unless told not to
  bleed: {
    marginHorizontal: -layout.screenEdge,
    flexGrow: 0,
    flexShrink: 0,
  },
  noGrow: {
    flexGrow: 0,
    flexShrink: 0,
  },
  rowContent: {
    gap: space[12],
    paddingHorizontal: layout.screenEdge,
  },
  pickCard: {
    width: space[48] * 5,
    gap: space[8],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  pickWarm: {
    borderColor: c.surfaceWarm,
    backgroundColor: c.surfaceWarm,
  },
  pickTitle: {
    ...type.label,
    color: c.ink,
  },
  pickMeta: {
    ...type.caption,
    color: c.inkMuted,
  },
  guide: {
    width: space[48] * 4,
    gap: space[4],
  },
  guideArt: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.medium,
    marginBottom: space[4],
  },
  guideTitle: {
    ...type.label,
    color: c.ink,
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
