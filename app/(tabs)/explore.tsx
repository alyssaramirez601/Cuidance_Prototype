import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { CollageHeader } from '@/components/CollageHeader';
import { ListRow } from '@/components/ListRow';
import { LoadingState } from '@/components/LoadingState';
import { ProductMiniCard } from '@/components/ProductMiniCard';
import { ProductThumb } from '@/components/ProductThumb';
import { Screen } from '@/components/Screen';
import { TextInput } from '@/components/TextInput';
import { layout, radius, space, stroke, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';
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

function ExploreContent({ userId }: { userId: string }) {
  const styles = useStyles();
  const router = useRouter();
  const { state } = useProfileData(userId);
  const [query, setQuery] = useState('');

  const answers = state.status === 'ready' ? state.data.answers : {};
  const forYou = productsFor({ areas: pickedAreas(answers) }).slice(0, 8);
  const searching = query.trim().length > 0;

  // Laid out like the Sephora app's Shop tab (Alyssa's reference, Nov 17): search with scan,
  // a row you can swipe, then every category as a two-column grid of tiles
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
    <Screen>
      <CollageHeader variant="explore" title={exploreCopy.title} intro={exploreCopy.intro} />

      <View style={styles.searchRow}>
        <View style={styles.searchField}>
          <TextInput
            label={exploreCopy.searchLabel}
            placeholder={exploreCopy.searchPlaceholder}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>
        <Pressable
          onPress={() => router.push('/explore/scan')}
          accessibilityRole="button"
          accessibilityLabel={exploreCopy.scan}
          style={({ pressed }) => [styles.scan, pressed && styles.pressed]}
        >
          <Text style={styles.scanText}>{exploreCopy.scan}</Text>
        </Pressable>
      </View>

      {searching ? (
        <SearchResults query={query} />
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {productsCopy.forYou}
            </Text>
            {state.status === 'loading' ? null : forYou.length ? (
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
            ) : (
              <View style={styles.quizCard}>
                <Text style={styles.body}>{exploreCopy.noGuidance}</Text>
                <Button label={exploreCopy.takeQuiz} onPress={() => router.push('/quiz/q1_areas')} />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {exploreCopy.allCategories}
            </Text>
            <View style={styles.grid}>
              {tiles.map((tile, index) => (
                <Pressable
                  key={tile.key}
                  onPress={tile.go}
                  accessibilityRole="button"
                  accessibilityLabel={tile.label}
                  style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
                >
                  <Text style={styles.tileLabel}>{tile.label}</Text>
                  {/* A colored arch window behind each tile's art, like the cut-paper canvas */}
                  <View style={[styles.tileWindow, styles[TILE_WINDOWS[index % TILE_WINDOWS.length]]]} />
                  <Image source={tile.art} style={styles.tileArt} contentFit="contain" accessible={false} />
                </Pressable>
              ))}
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

const TILE_WINDOWS = ['windowBlue', 'windowClay', 'windowGreen', 'windowOlive'] as const;

const useStyles = makeStyles((c, g) => StyleSheet.create({
  // Search gets the full width so its placeholder is never cut off, with Scan on its own line below
  searchRow: {
    gap: space[8],
  },
  searchField: {
    alignSelf: 'stretch',
  },
  // Same height as the input, so the two line up
  scan: {
    alignSelf: 'flex-start',
    height: layout.buttonHeight,
    paddingHorizontal: space[16],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.small,
    borderWidth: stroke.default,
    borderColor: c.borderStrong,
    backgroundColor: c.surface,
  },
  scanText: {
    ...type.label,
    color: c.accent,
  },
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
  quizCard: {
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.surfaceWarm,
    boxShadow: g.shadowPaper,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: space[12],
  },
  // Two per row: title top left, art bottom right, like the reference
  tile: {
    width: '48%',
    height: space[48] * 2 + space[24],
    padding: space[12],
    borderRadius: radius.medium,
    backgroundColor: c.surface,
    overflow: 'hidden',
    boxShadow: g.shadowLift,
  },
  tileWindow: {
    position: 'absolute',
    right: space[8],
    bottom: -space[8],
    width: space[48] + space[24],
    height: space[48] * 2,
    borderTopLeftRadius: radius.pill,
    borderTopRightRadius: radius.pill,
    borderBottomLeftRadius: radius.small,
    borderBottomRightRadius: radius.small,
    boxShadow: g.shadowShape,
  },
  windowBlue: { backgroundColor: g.waveBlue },
  windowClay: { backgroundColor: g.clay },
  windowGreen: { backgroundColor: g.green },
  windowOlive: { backgroundColor: g.olive },
  tileLabel: {
    ...type.label,
    color: c.ink,
    width: '70%',
  },
  tileArt: {
    position: 'absolute',
    right: space[8],
    bottom: space[8],
    width: space[48] + space[8],
    height: space[48] + space[16],
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
}));
