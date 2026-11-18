import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AddToBoardSheet } from '@/components/AddToBoardSheet';
import { Button } from '@/components/Button';
import { EvidenceDots } from '@/components/EvidenceDots';
import { Toast } from '@/components/Toast';
import { ListRow } from '@/components/ListRow';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { colors, layout, radius, space, stroke, type } from '@/constants/tokens';
import { findCategory, findDepartment } from '@/data/categories';
import { savedCopy } from '@/data/draftCopy';
import { productCopy } from '@/data/exploreCopy';
import { useAuth } from '@/hooks/useAuth';
import { useUserProducts } from '@/hooks/useUserProducts';
import { findProduct, notedIngredients, productImage, storeLinks } from '@/lib/explore';

const c = colors.light;

// Prototype screen 14 (product detail), with label facts only and links out to stores
export default function ProductScreen() {
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

      <View style={styles.hero}>
        {image.kind === 'scene' ? (
          <Image source={image.source} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
        ) : (
          <Image source={image.source} style={styles.heroArt} contentFit="contain" accessible={false} />
        )}
      </View>

      {session ? <SaveOwnButtons userId={session.user.id} productId={product.id} /> : null}

      <View style={styles.facts}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.path}>{[department?.label, category?.label, sub?.label].filter(Boolean).join(' › ')}</Text>
        <Fact label={productCopy.typeLabel} value={product.type} />
        <Fact label={productCopy.sizeLabel} value={product.size} />
      </View>

      {product.hasShades ? (
        <View style={styles.shadeBox}>
          <Text style={styles.body}>{productCopy.shadeNote}</Text>
          <Text style={styles.caption}>{productCopy.shadePick}</Text>
        </View>
      ) : null}

      {noted.length ? (
        <View style={styles.section}>
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
        </View>
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
function SaveOwnButtons({ userId, productId }: { userId: string; productId: string }) {
  const { state, find, update, actionError } = useUserProducts(userId);
  const [busy, setBusy] = useState<'saved' | 'owned' | null>(null);
  const [toast, setToast] = useState('');
  const [boardOpen, setBoardOpen] = useState(false);
  const mine = find(productId);
  const ready = state.status === 'ready';

  async function toggle(field: 'saved' | 'owned') {
    setToast('');
    setBusy(field);
    const turningOn = !mine?.[field];
    const ok = await update(productId, { [field]: turningOn });
    setBusy(null);
    if (ok && turningOn) setToast(field === 'saved' ? savedCopy.savedToast : savedCopy.ownedToast);
  }

  return (
    <View style={styles.actions}>
      <View style={styles.actionRow}>
        <View style={styles.actionCell}>
          <Button
            label={mine?.saved ? savedCopy.savedButton : savedCopy.save}
            style={mine?.saved ? 'primary' : 'secondary'}
            state={ready ? undefined : 'disabled'}
            loading={busy === 'saved'}
            onPress={() => toggle('saved')}
          />
        </View>
        <View style={styles.actionCell}>
          <Button
            label={mine?.owned ? savedCopy.ownedButton : savedCopy.own}
            style={mine?.owned ? 'primary' : 'secondary'}
            state={ready ? undefined : 'disabled'}
            loading={busy === 'owned'}
            onPress={() => toggle('owned')}
          />
        </View>
      </View>
      <Button label={savedCopy.addToBoard} style="ghost" onPress={() => setBoardOpen(true)} />
      {toast ? <Toast type="success" message={toast} /> : null}
      {actionError ? <Toast type="error" message={actionError} /> : null}
      <AddToBoardSheet visible={boardOpen} onClose={() => setBoardOpen(false)} userId={userId} kind="product" pinRef={productId} />
    </View>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.caption}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    aspectRatio: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.medium,
    backgroundColor: c.surfaceWarm,
  },
  heroArt: {
    width: '60%',
    height: '80%',
  },
  facts: {
    gap: space[8],
  },
  actions: {
    gap: space[8],
  },
  actionRow: {
    flexDirection: 'row',
    gap: space[8],
  },
  actionCell: {
    flex: 1,
  },
  brand: {
    ...type.label,
    color: c.ink,
  },
  path: {
    ...type.caption,
    color: c.inkMuted,
  },
  fact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space[12],
    paddingVertical: space[8],
    borderTopWidth: stroke.default,
    borderTopColor: c.border,
  },
  factValue: {
    ...type.label,
    color: c.ink,
    flexShrink: 1,
    textAlign: 'right',
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
    ...type.title,
    color: c.ink,
  },
  noteRow: {
    gap: space[4],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.surface,
    borderWidth: stroke.default,
    borderColor: c.border,
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
});
