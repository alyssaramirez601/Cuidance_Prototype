import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Appear } from '@/components/Appear';
import { Button } from '@/components/Button';
import { EvidenceDots } from '@/components/EvidenceDots';
import { ListRow } from '@/components/ListRow';
import { ProductActions } from '@/components/ProductActions';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { layout, letterSpacing, radius, space, stroke, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';
import { findCategory, findDepartment } from '@/data/categories';
import { productCopy } from '@/data/exploreCopy';
import { useAuth } from '@/hooks/useAuth';
import { findProduct, notedIngredients, productImage, storeLinks } from '@/lib/explore';

// Prototype screen 14 (product detail), with label facts only and links out to stores
export default function ProductScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = findProduct(id);
  const { session } = useAuth();
  const [showAll, setShowAll] = useState(false);

  if (!product) {
    return (
      <Screen>
        <PageHeader title={productCopy.notFoundTitle} intro={productCopy.notFoundBody} backTo="/explore" />
        <Button label={productCopy.searchInstead} onPress={() => router.navigate('/explore')} />
      </Screen>
    );
  }

  const department = findDepartment(product.department);
  const category = findCategory(product.department, product.category);
  const sub = category?.subs.find((s) => s.id === product.sub);
  const noted = notedIngredients(product);
  const image = productImage(product);

  return (
    <Screen>
      <PageHeader title={product.name} backTo="/explore" />

      {/* Direction A (Nov 20 redesign): a clay color block with the brand's sun and arch, and the
          product art in an arch window */}
      <Appear style={styles.hero}>
        <View style={styles.heroSun} />
        <View style={styles.heroArch} />
        <View style={styles.window}>
          {image.kind === 'scene' ? (
            <Image source={image.source} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
          ) : (
            <Image source={image.source} style={styles.heroArt} contentFit="contain" accessible={false} />
          )}
        </View>
      </Appear>

      <Appear order={1} style={styles.facts}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.path}>{[department?.label, category?.label, sub?.label].filter(Boolean).join(' › ')}</Text>
      </Appear>

      {session ? (
        <Appear order={2}>
          <ProductActions userId={session.user.id} productId={product.id} />
        </Appear>
      ) : null}

      <Appear order={3} style={styles.factGrid}>
        <Fact label={productCopy.typeLabel} value={product.type} />
        <Fact label={productCopy.sizeLabel} value={product.size} />
      </Appear>

      {product.hasShades ? (
        <View style={styles.shadeBox}>
          <Text style={styles.body}>{productCopy.shadeNote}</Text>
          <Text style={styles.caption}>{productCopy.shadePick}</Text>
        </View>
      ) : null}

      {noted.length ? (
        <Appear order={4} style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            {productCopy.keyTitle}
          </Text>
          <Text style={styles.caption}>{productCopy.keyHelper}</Text>
          {noted.map(({ label, note }) => (
            <View key={note.code + note.name} style={styles.noteRow}>
              <View style={styles.noteHead}>
                <Text style={styles.noteName}>{label}</Text>
                <EvidenceDots evidence={note.evidence} />
              </View>
              <Text style={styles.body}>{note.role}</Text>
            </View>
          ))}
        </Appear>
      ) : null}

      <View style={styles.section}>
        <Pressable
          onPress={() => setShowAll((open) => !open)}
          accessibilityRole="button"
          accessibilityState={{ expanded: showAll }}
          accessibilityLabel={showAll ? productCopy.hide : productCopy.show}
          style={styles.toggle}
        >
          <Text style={styles.sectionTitle}>{productCopy.allTitle}</Text>
          <Text style={styles.link}>{showAll ? productCopy.hide : productCopy.show}</Text>
        </Pressable>
        {showAll ? (
          <>
            <Text style={styles.body}>{product.ingredients.join(', ')}</Text>
            {product.mayContain ? (
              <Text style={styles.caption}>
                {productCopy.mayContain} {product.mayContain.join(', ')}
              </Text>
            ) : null}
            <Text style={styles.caption}>{productCopy.listNote}</Text>
          </>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {productCopy.whereTitle}
        </Text>
        {storeLinks(product).map((link) => (
          <ListRow
            key={link.store}
            label={link.checked ? productCopy.viewAt(link.store) : productCopy.searchAt(link.store)}
            onPress={() => Linking.openURL(link.url)}
          />
        ))}
        <Text style={styles.caption}>{productCopy.whereNote}</Text>
      </View>

      <Text style={styles.caption}>{productCopy.infoOnly}</Text>
    </Screen>
  );
}

// Save and "I own this", like the heart on Ulta's and Sephora's product pages
function Fact({ label, value }: { label: string; value: string }) {
  const styles = useStyles();
  return (
    <View style={styles.fact}>
      <Text style={styles.caption}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const useStyles = makeStyles((c, g) => StyleSheet.create({
  hero: {
    marginHorizontal: -layout.screenEdge,
    paddingVertical: space[32],
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: g.clay,
  },
  // Decorative shapes behind the art, never behind text
  heroSun: {
    position: 'absolute',
    left: -space[48],
    bottom: -space[48],
    width: space[48] * 4,
    height: space[48] * 4,
    borderRadius: radius.pill,
    backgroundColor: g.orange,
  },
  heroArch: {
    position: 'absolute',
    right: -space[24],
    bottom: 0,
    width: space[48] * 3,
    height: space[48] * 4,
    borderTopLeftRadius: radius.pill,
    borderTopRightRadius: radius.pill,
    backgroundColor: g.greenBold,
  },
  window: {
    width: '55%',
    aspectRatio: 3 / 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: radius.pill,
    borderTopRightRadius: radius.pill,
    borderBottomLeftRadius: radius.medium,
    borderBottomRightRadius: radius.medium,
    borderWidth: space[4] + space[4],
    borderColor: g.paper,
    backgroundColor: c.surfaceWarm,
  },
  heroArt: {
    width: '80%',
    height: '80%',
  },
  facts: {
    gap: space[4],
  },
  brand: {
    ...type.label,
    color: c.highlight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  factGrid: {
    flexDirection: 'row',
    gap: space[12],
  },
  path: {
    ...type.caption,
    color: c.inkMuted,
  },
  fact: {
    flex: 1,
    gap: space[4],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.surfaceWarm,
  },
  factValue: {
    ...type.label,
    color: c.ink,
  },
  shadeBox: {
    gap: space[8],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.surface,
    borderWidth: stroke.default,
    borderColor: c.border,
  },
  section: {
    gap: space[8],
  },
  sectionTitle: {
    ...type.heading,
    color: c.ink,
  },
  noteRow: {
    gap: space[4],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.surfaceWarm,
  },
  noteHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[8],
  },
  noteName: {
    ...type.label,
    color: c.ink,
    flexShrink: 1,
  },
  toggle: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    ...type.label,
    color: c.accent,
  },
  body: {
    ...type.body,
    color: c.ink,
  },
  caption: {
    ...type.caption,
    color: c.inkMuted,
  },
}));
