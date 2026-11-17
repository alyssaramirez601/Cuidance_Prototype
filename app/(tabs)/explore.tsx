import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AnswerTag } from '@/components/AnswerTag';
import { Button } from '@/components/Button';
import { ListRow } from '@/components/ListRow';
import { LoadingState } from '@/components/LoadingState';
import { ProductCard } from '@/components/ProductCard';
import { Screen } from '@/components/Screen';
import { Sheet } from '@/components/Sheet';
import { TextInput } from '@/components/TextInput';
import { colors, layout, radius, space, stroke, type } from '@/constants/tokens';
import { departments } from '@/data/categories';
import { areaLabels } from '@/data/draftCopy';
import { exploreCopy, productsCopy } from '@/data/exploreCopy';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { productArt, productsFor, searchArticles, searchIngredients, searchProducts } from '@/lib/explore';
import { answerTags, pickedAreas } from '@/lib/quizFlow';
import { profileArt } from '@/data/profileCopy';

const c = colors.light;

// Prototype screen 08. Searching shows results right here, grouped by products, ingredients and articles
export default function ExploreScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={exploreCopy.title} />;
  return <ExploreContent userId={session.user.id} />;
}

function ExploreContent({ userId }: { userId: string }) {
  const router = useRouter();
  const { state } = useProfileData(userId);
  const [query, setQuery] = useState('');
  const [scanOpen, setScanOpen] = useState(false);

  const answers = state.status === 'ready' ? state.data.answers : {};
  const areas = pickedAreas(answers);
  const tags = answerTags(answers).slice(0, 4);
  const forYou = productsFor({ areas }).slice(0, 6);
  const searching = query.trim().length > 0;

  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        {exploreCopy.title}
      </Text>

      <TextInput
        label={exploreCopy.searchLabel}
        placeholder={exploreCopy.searchPlaceholder}
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        autoCorrect={false}
      />
      <Button label={exploreCopy.scan} style="secondary" onPress={() => setScanOpen(true)} />

      {searching ? (
        <SearchResults query={query} />
      ) : (
        <>
          <View style={styles.shortcuts}>
            <ListRow label={exploreCopy.shortcuts.products} onPress={() => router.push('/explore/products')} />
            <ListRow label={exploreCopy.shortcuts.ingredients} onPress={() => router.push('/explore/ingredients')} />
            <ListRow label={exploreCopy.shortcuts.education} onPress={() => router.push('/explore/education')} />
            <ListRow label={exploreCopy.shortcuts.guidance} onPress={() => router.push('/quiz/result')} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle} accessibilityRole="header">
              {exploreCopy.guidanceTitle}
            </Text>
            {state.status === 'loading' ? null : tags.length ? (
              <>
                <Text style={styles.body}>{exploreCopy.guidanceBody}</Text>
                <Text style={styles.meta}>{exploreCopy.usingDetails}</Text>
                <View style={styles.tags}>
                  {tags.map((tag) => (
                    <AnswerTag key={tag} label={tag} />
                  ))}
                </View>
                <Button
                  label={exploreCopy.startExploring}
                  onPress={() => router.push({ pathname: '/explore/products', params: { forYou: '1' } })}
                />
              </>
            ) : (
              <>
                <Text style={styles.body}>{exploreCopy.noGuidance}</Text>
                <Button label={exploreCopy.takeQuiz} onPress={() => router.push('/quiz/q1_areas')} />
              </>
            )}
          </View>

          {forYou.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                {productsCopy.forYou}
              </Text>
              <Text style={styles.meta}>{productsCopy.forYouNote}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
                {forYou.map((product) => (
                  <ProductCard
                    key={product.id}
                    brand={product.brand}
                    name={product.name}
                    fitLabel={capitalize(areaLabels[product.area])}
                    image={productArt(product)}
                    onPress={() => router.push(`/explore/product/${product.id}`)}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {exploreCopy.productsHeading}
            </Text>
            {departments.map((department) => (
              <ListRow
                key={department.id}
                label={department.label}
                leading={
                  department.area ? (
                    <Image source={profileArt.areas[department.area]} style={styles.deptArt} contentFit="contain" accessible={false} />
                  ) : undefined
                }
                onPress={() => router.push({ pathname: '/explore/products', params: { department: department.id } })}
              />
            ))}
          </View>
        </>
      )}

      <Sheet visible={scanOpen} title={exploreCopy.scanSoonTitle} onClose={() => setScanOpen(false)}>
        <View style={styles.sheetBody}>
          <Text style={styles.body}>{exploreCopy.scanSoonBody}</Text>
          <Button label={exploreCopy.scanSoonButton} onPress={() => setScanOpen(false)} />
        </View>
      </Sheet>
    </Screen>
  );
}

function SearchResults({ query }: { query: string }) {
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
          leading={<Image source={productArt(product)} style={styles.deptArt} contentFit="contain" accessible={false} />}
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

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const styles = StyleSheet.create({
  title: {
    ...type.heading,
    color: c.ink,
  },
  shortcuts: {
    gap: space[8],
  },
  card: {
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  cardTitle: {
    ...type.title,
    color: c.ink,
  },
  body: {
    ...type.body,
    color: c.inkMuted,
  },
  meta: {
    ...type.caption,
    color: c.inkMuted,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[8],
  },
  section: {
    gap: space[8],
  },
  sectionTitle: {
    ...type.title,
    color: c.ink,
    marginTop: space[8],
  },
  carousel: {
    gap: space[12],
    paddingRight: layout.screenEdge,
  },
  deptArt: {
    width: space[32] + space[8],
    height: space[48],
  },
  sheetBody: {
    gap: space[16],
  },
});
