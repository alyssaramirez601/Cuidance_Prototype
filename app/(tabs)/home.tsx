import { useFocusEffect, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Appear } from '@/components/Appear';
import { CareAreaTile } from '@/components/CareAreaTile';
import { Chip } from '@/components/Chip';
import { ContinuationBand } from '@/components/ContinuationBand';
import { DisclosureLabel } from '@/components/DisclosureLabel';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { EmptyState } from '@/components/EmptyState';
import { FeatureCard } from '@/components/FeatureCard';
import { GuideRow } from '@/components/GuideRow';
import { HomeHeader } from '@/components/HomeHeader';
import { Icon } from '@/components/Icon';
import { ListRow } from '@/components/ListRow';
import { LoadError } from '@/components/LoadError';
import { LoadingState } from '@/components/LoadingState';
import { PartnerHighlightCard } from '@/components/PartnerHighlightCard';
import { ProductMiniCard } from '@/components/ProductMiniCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Skeleton } from '@/components/Skeleton';
import { SwipeRow } from '@/components/SwipeRow';
import { layout, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { makeStyles, useColors, useTheme } from '@/hooks/useTheme';
import { homeCopy, partnerPlaceholders } from '@/data/appCopy';
import { departments } from '@/data/categories';
import { articles } from '@/data/education';
import { exploreCopy, productsCopy } from '@/data/exploreCopy';
import { careArt, featureArt, homeCareDepartments } from '@/data/homeArt';
import { partnerProducts } from '@/data/partnerContent';
import { useAuth } from '@/hooks/useAuth';
import { firstNameFrom } from '@/lib/auth';
import { isFocused } from '@/lib/focus';
import { articleArt, productsFor } from '@/lib/explore';
import { homeDataFrom, homeState, type HomeData } from '@/lib/homeState';
import { loadAllAnswers } from '@/lib/quizAnswers';
import { pickedAreas } from '@/lib/quizFlow';
import { listSavedResults } from '@/lib/savedResults';

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; data: HomeData };

// Home shows the first three guides; "See all" opens every one in Education (Alyssa, Nov 25)
const GUIDES_ON_HOME = 3;
// Text size where the four care tiles become a two-by-two grid
const CARE_GRID_AT_FONT_SCALE = 1.3;

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

// Home v2 "Editorial Care" (Nov 25, 2026). Section order: header, search, your guidance, care areas,
// pick up where you left off, for you, guides and tips, partner highlights. All data and destinations
// are the ones Home already used; lib/homeState.ts decides what the feature card and band show
function HomeContent({ userId, name }: { userId: string; name: string }) {
  const styles = useStyles();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async () => {
    const [answers, saved] = await Promise.all([loadAllAnswers(userId), listSavedResults(userId)]);
    if (!answers.ok || !saved.ok) {
      setState({ status: 'error', message: homeCopy.loadError });
      return;
    }
    setState({ status: 'ready', data: homeDataFrom(answers.answers, saved.results) });
  }, [userId]);

  // Refreshes when someone comes back to Home, so a new save or answer shows up
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const top = (
    <>
      <HomeHeader
        greeting={greetingFor(new Date().getHours())}
        name={name}
        onProfilePress={() => router.navigate('/profile')}
        onNotificationsPress={() => router.push('/profile/notifications')}
        notificationsLabel={exploreCopy.notifications}
      />
      <SearchEntry />
    </>
  );

  if (state.status === 'loading') {
    return (
      <Screen>
        {top}
        <HomeSkeleton />
      </Screen>
    );
  }

  if (state.status === 'error') {
    return (
      <Screen>
        {top}
        <LoadError message={state.message} onRetry={load} />
      </Screen>
    );
  }

  const data = state.data;
  return (
    <Screen>
      {top}
      <Appear order={2}>
        <GuidanceFeature data={data} />
      </Appear>
      <Appear order={3} style={styles.section}>
        <CareAreas />
      </Appear>
      <Appear order={4} style={styles.section}>
        <PickUp data={data} />
      </Appear>
      <Appear order={5} style={styles.section}>
        <ForYou data={data} />
      </Appear>
      <Appear order={6} style={styles.section}>
        <SectionHeader title={homeCopy.guidesTitle} actionLabel={homeCopy.seeAll} onAction={() => router.push('/explore/education')} />
        <View>
          {articles.slice(0, GUIDES_ON_HOME).map((article, index) => (
            <GuideRow
              key={article.id}
              title={article.title}
              eyebrow={`${article.kind} · ${homeCopy.readTime(article.minutes)}`}
              art={articleArt(article.id)}
              onPress={() => router.push(`/explore/article/${article.id}`)}
              divider={index < GUIDES_ON_HOME - 1}
            />
          ))}
        </View>
      </Appear>
      <Appear order={7} style={styles.partners}>
        <PartnerHighlights />
      </Appear>
    </Screen>
  );
}

// Looks like a search field, like Ulta's and Sephora's Home, and opens Explore where search lives
function SearchEntry() {
  const styles = useStyles();
  const c = useColors();
  const router = useRouter();
  return (
    <Appear order={1}>
      <Pressable
        onPress={() => router.navigate('/explore')}
        accessibilityRole="search"
        accessibilityLabel={homeCopy.searchHint}
        style={(state) => [styles.search, isFocused(state) && styles.focused]}
      >
        <Icon name="search" size={sizes.icon.medium} color={c.inkMuted} />
        <Text style={styles.searchText}>{homeCopy.searchHint}</Text>
      </Pressable>
    </Appear>
  );
}

function GuidanceFeature({ data }: { data: HomeData }) {
  const router = useRouter();
  const { feature } = homeState(data);
  if (feature.kind === 'result') {
    return (
      <FeatureCard
        eyebrow={homeCopy.yourResult}
        title={feature.result.name || homeCopy.yourResult}
        body={feature.result.subtitle || homeCopy.revisit}
        actionLabel={homeCopy.viewResult}
        onPress={() => router.push(`/saved/${feature.result.id}`)}
        art={<FeatureArt area={feature.area} />}
      />
    );
  }
  if (feature.kind === 'quiz') {
    return (
      <FeatureCard
        title={homeCopy.resumeTitle}
        body={homeCopy.questionsLeft(feature.questionsLeft)}
        actionLabel={homeCopy.resumeButton}
        onPress={() => router.push(`/quiz/${feature.nextQuestionId}`)}
        art={<FeatureArt area={null} />}
      />
    );
  }
  return (
    <FeatureCard
      title={homeCopy.getGuidance}
      body={homeCopy.getGuidanceDetail}
      onPress={() => router.push(`/quiz/${feature.questionId}`)}
      art={<FeatureArt area={null} />}
    />
  );
}

// TEMPORARY art for the feature card until the approved feature illustrations arrive (data/homeArt.ts)
function FeatureArt({ area }: { area: Parameters<typeof featureArt>[0] }) {
  const styles = useStyles();
  const { scheme } = useTheme();
  const art = featureArt(area);
  return (
    <View style={styles.featureArt} accessible={false}>
      <View style={styles.featureSun} />
      {art ? (
        <Image source={art[scheme]} style={styles.featureImage} contentFit="contain" accessible={false} />
      ) : (
        <View style={styles.featureArch} />
      )}
    </View>
  );
}

function CareAreas() {
  const styles = useStyles();
  const router = useRouter();
  const { scheme } = useTheme();
  const { fontScale } = useWindowDimensions();
  const columns = fontScale >= CARE_GRID_AT_FONT_SCALE ? 2 : 4;
  const tiles = homeCareDepartments
    .map((id) => departments.find((department) => department.id === id))
    .filter((department) => department !== undefined);
  const rows: (typeof tiles)[] = [];
  for (let index = 0; index < tiles.length; index += columns) rows.push(tiles.slice(index, index + columns));
  return (
    <>
      <SectionHeader title={homeCopy.careTitle} actionLabel={homeCopy.viewAll} onAction={() => router.navigate('/explore')} />
      <View style={styles.careGrid}>
        {rows.map((row) => (
          <View key={row.map((department) => department.id).join()} style={styles.careRow}>
            {row.map((department) => (
              <CareAreaTile
                key={department.id}
                label={department.label}
                art={careArt[department.id][scheme]}
                onPress={() => router.push({ pathname: '/explore/department/[id]', params: { id: department.id } })}
              />
            ))}
          </View>
        ))}
      </View>
    </>
  );
}

function PickUp({ data }: { data: HomeData }) {
  const router = useRouter();
  const { continueSlot } = homeState(data);
  const attributes = { label: homeCopy.attributesTitle, detail: homeCopy.attributesDetail, onPress: () => router.push('/profile/attributes') };
  return (
    <>
      <SectionHeader title={homeCopy.resumeEyebrow} />
      {continueSlot.kind === 'quiz' ? (
        <ContinuationBand
          icon="help"
          title={homeCopy.resumeTitle}
          detail={homeCopy.questionsLeft(continueSlot.questionsLeft)}
          actionLabel={homeCopy.resumeButton}
          onPress={() => router.push(`/quiz/${continueSlot.nextQuestionId}`)}
          secondary={attributes}
        />
      ) : (
        <ContinuationBand icon="profile" title={attributes.label} detail={attributes.detail} onPress={attributes.onPress} />
      )}
    </>
  );
}

function ForYou({ data }: { data: HomeData }) {
  const router = useRouter();
  const products = productsFor({ areas: pickedAreas(data.answers) }).slice(0, 8);
  const [first, ...rest] = products;
  return (
    <>
      <SectionHeader
        title={productsCopy.forYou}
        actionLabel={first ? homeCopy.seeAll : undefined}
        onAction={() => router.push({ pathname: '/explore/products', params: { forYou: '1' } })}
      />
      {first ? (
        <>
          <EditorialProductCard product={first} onPress={() => router.push(`/explore/product/${first.id}`)} />
          {rest.length ? (
            <SwipeRow title={productsCopy.forYou} header={<></>}>
              {rest.map((product) => (
                <ProductMiniCard
                  key={product.id}
                  product={product}
                  label={product.name}
                  onPress={() => router.push(`/explore/product/${product.id}`)}
                />
              ))}
            </SwipeRow>
          ) : null}
        </>
      ) : (
        // No care areas picked yet: the same prompt and action Explore uses for this case
        <EmptyState body={exploreCopy.forYouPrompt} actionLabel={exploreCopy.takeQuiz} onAction={() => router.push('/quiz/q1_areas')} />
      )}
    </>
  );
}

// Sample partner content until real partners sign on. Always labeled Partner content.
// The chips change selection only, as before v2; filtering is a separate team decision
function PartnerHighlights() {
  const styles = useStyles();
  const router = useRouter();
  const [partnerFilter, setPartnerFilter] = useState(partnerPlaceholders.filters[1]);
  return (
    <>
      {/* TEMPORARY until assets/home/partner-accent-{light,dark}.png: a cut-paper circle drawn in code */}
      <View style={styles.partnerShape} accessible={false} />
      <View style={styles.partnerHead}>
        <SectionHeader title={partnerPlaceholders.title} tone="partnerBand" />
        <DisclosureLabel type="partner" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.rowContent}>
        {partnerPlaceholders.filters.map((filter) => (
          <Chip key={filter} label={filter} state={filter === partnerFilter ? 'selected' : 'default'} onPress={() => setPartnerFilter(filter)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.cardRow}>
        {partnerProducts.slice(0, 3).map((product) => (
          <PartnerHighlightCard
            key={product.id}
            brand={product.brand}
            name={product.name}
            image={product.image}
            onPress={() => router.push({ pathname: '/shop/product/[id]', params: { id: product.id } })}
          />
        ))}
      </ScrollView>
      <Text style={styles.placeholderNote}>{partnerPlaceholders.note}</Text>
      <ListRow label={partnerPlaceholders.seeAll} onPress={() => router.navigate('/shop')} />
    </>
  );
}

// Shaped like the sections that are loading, so nothing jumps when they arrive
function HomeSkeleton() {
  const styles = useStyles();
  return (
    <View style={styles.skeleton} accessible accessibilityRole="progressbar" accessibilityLabel={homeCopy.loading}>
      <Skeleton height={space[48] * 4} />
      <Skeleton height={space[32]} width="60%" shape="small" />
      <View style={styles.careRow}>
        <Skeleton height={space[48] * 2} width="23%" />
        <Skeleton height={space[48] * 2} width="23%" />
        <Skeleton height={space[48] * 2} width="23%" />
        <Skeleton height={space[48] * 2} width="23%" />
      </View>
      <Skeleton height={space[48] + space[32]} />
      <Skeleton height={space[32]} width="40%" shape="small" />
      <Skeleton height={space[48] * 3} />
    </View>
  );
}

const useStyles = makeStyles((c, g) => StyleSheet.create({
  // With the page's own 16 gap, sections sit 24 apart
  section: {
    gap: space[12],
    marginTop: space[8],
  },
  search: {
    minHeight: space[48] + space[8],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
    paddingHorizontal: space[16],
    borderRadius: radius.pill,
    borderWidth: stroke.default,
    borderColor: c.borderStrong,
    backgroundColor: c.surface,
  },
  focused: {
    outlineColor: c.accent,
    outlineStyle: 'solid',
    outlineWidth: stroke.strong,
  },
  searchText: {
    ...type.body,
    flex: 1,
    color: c.inkMuted,
  },
  featureArt: {
    width: '100%',
    aspectRatio: 240 / 276,
    justifyContent: 'flex-end',
  },
  featureSun: {
    position: 'absolute',
    right: -space[24],
    top: -space[12],
    width: space[48] * 2,
    height: space[48] * 2,
    borderRadius: radius.pill,
    backgroundColor: g.orange,
  },
  featureImage: {
    width: '100%',
    height: '100%',
  },
  featureArch: {
    alignSelf: 'center',
    width: '70%',
    height: '75%',
    borderTopLeftRadius: radius.pill,
    borderTopRightRadius: radius.pill,
    backgroundColor: g.clay,
  },
  careGrid: {
    gap: space[8],
  },
  careRow: {
    flexDirection: 'row',
    gap: space[8],
  },
  // Runs edge to edge as its own band, so partner content reads as a separate, commercial section
  partners: {
    gap: space[12],
    overflow: 'hidden',
    marginTop: space[16],
    marginHorizontal: -layout.screenEdge,
    // Runs to the bottom of the page too, instead of stopping above the screen's bottom padding
    marginBottom: -space[24],
    paddingHorizontal: layout.screenEdge,
    paddingVertical: space[32],
    borderTopLeftRadius: radius.medium,
    borderTopRightRadius: radius.medium,
    backgroundColor: c.partnerBand,
  },
  partnerShape: {
    position: 'absolute',
    right: -space[48],
    top: -space[48],
    width: space[48] * 3,
    height: space[48] * 3,
    borderRadius: radius.pill,
    backgroundColor: g.orange,
    opacity: 0.5,
  },
  partnerHead: {
    gap: space[8],
    paddingRight: space[48],
  },
  bleed: {
    marginHorizontal: -layout.screenEdge,
    flexGrow: 0,
    flexShrink: 0,
  },
  rowContent: {
    gap: space[8],
    paddingHorizontal: layout.screenEdge,
  },
  cardRow: {
    gap: space[12],
    paddingHorizontal: layout.screenEdge,
    paddingVertical: space[4],
  },
  placeholderNote: {
    ...type.caption,
    color: c.onPartnerBand,
  },
  skeleton: {
    gap: space[16],
  },
}));
