import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput as RNTextInput, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { ListRow } from '@/components/ListRow';
import { LoadingState } from '@/components/LoadingState';
import { ProductMiniCard } from '@/components/ProductMiniCard';
import { ProductThumb } from '@/components/ProductThumb';
import { Screen } from '@/components/Screen';
import { fontFamily, layout, radius, sizes, space, type } from '@/constants/tokens';
import { makeStyles, useTheme } from '@/hooks/useTheme';
import { departments } from '@/data/categories';
import { exploreArt, exploreCopy, productsCopy } from '@/data/exploreCopy';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { productsFor, searchArticles, searchIngredients, searchProducts } from '@/lib/explore';
import { pickedAreas } from '@/lib/quizFlow';

// Prototype screen 08. Searching shows results right here, grouped by products, ingredients and articles
export default function ExploreScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={exploreCopy.title} />;
  return <ExploreContent userId={session.user.id} />;
}

// Painted art cut from Alyssa's Nov 25 Explore designs (light and dark), not redrawn. Text, search
// and buttons sit on top as real, readable controls. Each art file keeps the paper it was painted on,
// so the page uses that same paper color (g.explorePage) and the edges disappear
const art = {
  light: {
    logo: require('@/assets/logo/logo-horizontal-green.png'),
    hero: require('@/assets/explore/hero-light.png'),
    forYou: require('@/assets/explore/foryou-light.png'),
    tiles: {
      makeup: require('@/assets/explore/tile-makeup-light.png'),
      skin: require('@/assets/explore/tile-skin-light.png'),
      hair: require('@/assets/explore/tile-hair-light.png'),
      fragrance: require('@/assets/explore/tile-fragrance-light.png'),
    } as Record<string, number>,
  },
  dark: {
    logo: require('@/assets/logo/logo-horizontal-light.png'),
    hero: require('@/assets/explore/hero-dark.png'),
    forYou: require('@/assets/explore/foryou-dark.png'),
    tiles: {
      makeup: require('@/assets/explore/tile-makeup-dark.png'),
      skin: require('@/assets/explore/tile-skin-dark.png'),
      hair: require('@/assets/explore/tile-hair-dark.png'),
      fragrance: require('@/assets/explore/tile-fragrance-dark.png'),
    } as Record<string, number>,
  },
};
// Width / height of each art file
const HERO_RATIO = 886 / 395;
const FOR_YOU_RATIO = 864 / 350;
const TILE_RATIO = 411 / 229;
const LOGO_RATIO = 1028 / 222;
// Logo version 4 full lockup minimum width, from CLAUDE.md
const LOGO_WIDTH = 160;

function ExploreContent({ userId }: { userId: string }) {
  const styles = useStyles();
  const router = useRouter();
  const { scheme, g } = useTheme();
  const look = art[scheme];
  const { state } = useProfileData(userId);
  const [query, setQuery] = useState('');

  const answers = state.status === 'ready' ? state.data.answers : {};
  const forYou = productsFor({ areas: pickedAreas(answers) }).slice(0, 8);
  const searching = query.trim().length > 0;

  // Every category as a two-column grid of tiles. The four with painted tiles in the design use them;
  // the rest use the art library on the same paper card until they get their own
  const tiles: { key: string; label: string; art: number; go: () => void }[] = [
    ...departments.map((d) => ({
      key: d.id,
      label: d.label,
      art: exploreArt[d.id],
      go: () => router.push({ pathname: '/explore/department/[id]', params: { id: d.id } }),
    })),
    { key: 'ingredients', label: exploreCopy.shortcuts.ingredients, art: exploreArt.ingredients, go: () => router.push('/explore/ingredients') },
    { key: 'education', label: exploreCopy.shortcuts.education, art: exploreArt.education, go: () => router.push('/explore/education') },
  ];

  return (
    <Screen background={g.explorePage}>
      <View style={styles.topBar}>
        <Image source={look.logo} style={styles.logo} contentFit="contain" accessibilityLabel="Cuidance" />
        <Pressable
          onPress={() => router.push('/profile/notifications')}
          accessibilityRole="button"
          accessibilityLabel={exploreCopy.notifications}
          style={styles.bell}
        >
          <Icon name="bell" size={sizes.icon.large} color={styles.heroTitle.color} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Image source={look.hero} style={styles.heroArt} contentFit="cover" accessible={false} />
        <View style={styles.heroText}>
          <Text style={styles.eyebrow}>{exploreCopy.eyebrow}</Text>
          <Text style={styles.heroTitle} accessibilityRole="header">
            {exploreCopy.title}
          </Text>
          <Text style={styles.heroIntro}>{exploreCopy.intro}</Text>
        </View>
      </View>

      <View style={styles.search}>
        <Icon name="search" size={sizes.icon.large} color={styles.heroTitle.color} />
        <RNTextInput
          accessibilityLabel={exploreCopy.searchLabel}
          placeholder={exploreCopy.searchPlaceholder}
          placeholderTextColor={styles.placeholder.color}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCorrect={false}
          style={styles.searchInput}
        />
      </View>
      <Pressable
        onPress={() => router.push('/explore/scan')}
        accessibilityRole="button"
        accessibilityLabel={exploreCopy.scan}
        style={({ pressed }) => [styles.scan, pressed && styles.pressed]}
      >
        <Icon name="scan" size={sizes.icon.medium} color={styles.heroTitle.color} />
        <Text style={styles.scanText}>{exploreCopy.scan}</Text>
      </Pressable>

      {searching ? (
        <SearchResults query={query} />
      ) : (
        <>
          {state.status === 'loading' ? null : forYou.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                {productsCopy.forYou}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.carousel}>
                {forYou.map((product) => (
                  <ProductMiniCard
                    key={product.id}
                    product={product}
                    label={product.name}
                    onPress={() => router.push(`/explore/product/${product.id}`)}
                  />
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.forYou}>
              <Image source={look.forYou} style={styles.forYouArt} contentFit="cover" accessible={false} />
              <View style={styles.forYouCard}>
                <View style={styles.forYouText}>
                  <Text style={styles.eyebrowLarge}>{exploreCopy.forYouEyebrow}</Text>
                  <Text style={styles.forYouPrompt}>{exploreCopy.forYouPrompt}</Text>
                </View>
                <Pressable
                  onPress={() => router.push('/quiz/q1_areas')}
                  accessibilityRole="button"
                  accessibilityLabel={exploreCopy.takeQuiz}
                  style={({ pressed }) => [styles.quizButton, pressed && styles.quizButtonPressed]}
                >
                  <Text style={styles.quizButtonText}>{exploreCopy.takeQuiz}</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.categoriesTitle} accessibilityRole="header">
              {exploreCopy.allCategories}
            </Text>
            <View style={styles.grid}>
              {tiles.map((tile) => {
                const painted = look.tiles[tile.key];
                return (
                  <Pressable
                    key={tile.key}
                    onPress={tile.go}
                    accessibilityRole="button"
                    accessibilityLabel={tile.label}
                    style={({ pressed }) => [styles.tileWrap, pressed && styles.tilePressed]}
                  >
                    {painted ? (
                      <Image source={painted} style={styles.fill} contentFit="cover" accessible={false} />
                    ) : (
                      <View style={styles.paperTile}>
                        <Image source={tile.art} style={styles.paperTileArt} contentFit="contain" accessible={false} />
                      </View>
                    )}
                    <Text style={styles.tileLabel}>{tile.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </>
      )}
    </Screen>
  );
}

function SearchResults({ query }: { query: string }) {
  const styles = useStyles();
  const router = useRouter();
  const found = searchProducts(query);
  const ingredients = searchIngredients(query).slice(0, 6);
  const articles = searchArticles(query);
  const total = found.length + ingredients.length + articles.length;

  if (total === 0) {
    return <Text style={styles.body}>{exploreCopy.noResults}</Text>;
  }
  return (
    <View style={styles.section}>
      <Text style={styles.meta} accessibilityLiveRegion="polite">
        {exploreCopy.searchResults(total, query.trim())}
      </Text>
      {found.length ? <Text style={styles.sectionTitle}>{exploreCopy.productsHeading}</Text> : null}
      {found.map((product) => (
        <ListRow
          key={product.id}
          label={product.name}
          detail={`${product.brand} · ${product.type}`}
          leading={<ProductThumb product={product} />}
          onPress={() => router.push(`/explore/product/${product.id}`)}
        />
      ))}
      {ingredients.length ? <Text style={styles.sectionTitle}>{exploreCopy.ingredientsHeading}</Text> : null}
      {ingredients.map((name) => (
        <ListRow key={name} label={name} onPress={() => router.push({ pathname: '/explore/ingredient/[name]', params: { name } })} />
      ))}
      {articles.length ? <Text style={styles.sectionTitle}>{exploreCopy.articlesHeading}</Text> : null}
      {articles.map((article) => (
        <ListRow key={article.id} label={article.title} onPress={() => router.push(`/explore/article/${article.id}`)} />
      ))}
    </View>
  );
}

// Colors from the design's own SVG files. Painted tiles stay cream in both modes, so their labels
// use Guidance Ink in both
const exploreInk = { light: '#21332B', dark: '#F4F2EC' };

const useStyles = makeStyles((c, g) => {
  const dark = g.explorePage === '#112920';
  const ink = dark ? exploreInk.dark : exploreInk.light;
  return StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -space[16],
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_WIDTH / LOGO_RATIO,
  },
  bell: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -space[8],
  },
  // The painted collage runs edge to edge behind the title, as in the design
  hero: {
    marginHorizontal: -layout.screenEdge,
    marginTop: -space[8],
    aspectRatio: HERO_RATIO,
  },
  heroArt: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  heroText: {
    paddingHorizontal: layout.screenEdge + space[4],
    paddingTop: space[12],
    maxWidth: '62%',
  },
  eyebrow: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: dark ? '#E3A27C' : c.highlight,
    width: 340,
  },
  heroTitle: {
    fontFamily: fontFamily.display,
    fontSize: 58,
    lineHeight: 64,
    letterSpacing: -2,
    color: ink,
  },
  heroIntro: {
    ...type.body,
    fontSize: 15,
    lineHeight: 19,
    color: ink,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    height: layout.buttonHeight,
    paddingHorizontal: space[16],
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: ink,
    backgroundColor: dark ? '#1A3528' : c.surface,
    boxShadow: g.shadowLift,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    ...type.body,
    color: ink,
    outlineStyle: 'none',
  } as object,
  placeholder: {
    color: dark ? '#D0D6CB' : '#666865',
  },
  // Stays above the For you art, whose painted sun reaches up beside it
  scan: {
    zIndex: 1,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
    minHeight: layout.minTouchTarget,
    paddingHorizontal: space[16],
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: ink,
  },
  scanText: {
    ...type.label,
    color: ink,
  },
  // The For you card is one painted piece (card, sun and dots); the words and button sit on it
  // The painted sun rises into the space beside Scan a product, as in the design
  forYou: {
    marginTop: -space[48],
    marginLeft: -(layout.screenEdge - 10),
    marginRight: -layout.screenEdge,
    aspectRatio: FOR_YOU_RATIO,
  },
  forYouArt: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  forYouCard: {
    position: 'absolute',
    left: '2.1%',
    top: '29.1%',
    width: '93.5%',
    height: '66.6%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
    paddingHorizontal: space[16],
    paddingVertical: space[8],
  },
  forYouText: {
    flex: 1,
    gap: 2,
  },
  eyebrowLarge: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: dark ? '#E3A27C' : c.highlight,
  },
  forYouPrompt: {
    fontFamily: fontFamily.display,
    fontSize: 16,
    lineHeight: 19,
    color: ink,
  },
  quizButton: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: space[16],
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F3FD1',
    boxShadow: g.shadowLift,
  },
  quizButtonPressed: {
    backgroundColor: '#152B91',
  },
  quizButtonText: {
    ...type.label,
    color: '#FFFFFF',
  },
  categoriesTitle: {
    fontFamily: fontFamily.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: ink,
    marginTop: space[4],
  },
  tileWrap: {
    width: '50%',
    aspectRatio: TILE_RATIO,
  },
  tilePressed: {
    transform: [{ scale: 0.96 }],
  },
  fill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  // Same paper card as the painted tiles, for categories without painted art yet
  paperTile: {
    position: 'absolute',
    top: '3.5%',
    right: '2%',
    bottom: '3.5%',
    left: '2%',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E0DAD0',
    backgroundColor: '#FEF6EF',
    overflow: 'hidden',
    boxShadow: g.shadowLift,
  },
  paperTileArt: {
    position: 'absolute',
    right: space[8],
    bottom: space[4],
    width: '50%',
    height: '78%',
  },
  tileLabel: {
    position: 'absolute',
    left: '9%',
    top: '12%',
    width: '60%',
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 19,
    color: '#111111',
  },
  // Search gets the full width so its placeholder is never cut off, with Scan on its own line below
  pressed: {
    backgroundColor: c.background,
  },
  section: {
    gap: space[12],
  },
  sectionTitle: {
    ...type.title,
    color: c.ink,
    marginTop: space[8],
  },
  // A sideways scroll row inside the page's scroll grows to fill the screen unless told not to
  bleed: {
    marginHorizontal: -layout.screenEdge,
    flexGrow: 0,
    flexShrink: 0,
  },
  carousel: {
    gap: space[16],
    paddingHorizontal: layout.screenEdge,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: space[12],
  },
  body: {
    ...type.body,
    color: c.inkMuted,
  },
  meta: {
    ...type.caption,
    color: c.inkMuted,
  },
  deptArt: {
    width: space[32] + space[8],
    height: space[48],
  },
  sheetBody: {
    gap: space[16],
  },
});
});
