import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image } from 'expo-image';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ArtTile } from '@/components/ArtTile';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { ListRow } from '@/components/ListRow';
import { LoadError } from '@/components/LoadError';
import { LoadingState } from '@/components/LoadingState';
import { ProductThumb } from '@/components/ProductThumb';
import { Screen } from '@/components/Screen';
import { Sheet } from '@/components/Sheet';
import { Tabs } from '@/components/Tabs';
import { TextInput } from '@/components/TextInput';
import { Toast } from '@/components/Toast';
import { colors, layout, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { savedCopy } from '@/data/draftCopy';
import { useAuth } from '@/hooks/useAuth';
import { useBoards } from '@/hooks/useBoards';
import { useSavedResults } from '@/hooks/useSavedResults';
import { useUserProducts } from '@/hooks/useUserProducts';
import { createBoard } from '@/lib/boards';
import { findProduct, pinView } from '@/lib/explore';
import { savedDateLabel, type SavedResult } from '@/lib/savedResults';
import { partnerFromRef } from '@/lib/shop';
import type { Reflection } from '@/lib/userProducts';

type SavedTab = 'guidance' | 'products' | 'owned' | 'boards';

const c = colors.light;

export default function SavedScreen() {
  const { session } = useAuth();
  const [tab, setTab] = useState<SavedTab>('guidance');
  if (!session) {
    return <LoadingState label={savedCopy.loading} />;
  }
  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        {savedCopy.title}
      </Text>
      <View style={styles.tabs}>
        <Tabs tabs={savedCopy.tabs} activeKey={tab} onChange={(key) => setTab(key as SavedTab)} />
      </View>
      {tab === 'guidance' ? <GuidanceTab userId={session.user.id} /> : null}
      {tab === 'products' ? <ProductsTab userId={session.user.id} /> : null}
      {tab === 'owned' ? <OwnedTab userId={session.user.id} /> : null}
      {tab === 'boards' ? <BoardsTab userId={session.user.id} /> : null}
    </Screen>
  );
}

function GuidanceTab({ userId }: { userId: string }) {
  const router = useRouter();
  const { state, retry } = useSavedResults(userId);

  if (state.status === 'loading') {
    return <LoadingState label={savedCopy.loading} />;
  }
  if (state.status === 'error') {
    return (
      <View style={styles.errorBox} accessibilityLiveRegion="polite">
        <Text style={styles.errorText}>{state.message}</Text>
        <Button label="Try again" style="secondary" onPress={retry} />
      </View>
    );
  }
  if (state.results.length === 0) {
    return (
      <EmptyState
        title={savedCopy.emptyTitle}
        body={savedCopy.emptyBody}
        action={{ label: savedCopy.emptyButton, onPress: () => router.push('/quiz/q1_areas') }}
      />
    );
  }
  return (
    <>
      <Text style={styles.intro}>{savedCopy.guidanceIntro}</Text>
      <FlatList
        data={state.results}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <SavedResultCard result={item} onPress={() => router.push(`/saved/${item.id}`)} />}
      />
    </>
  );
}

// Prototype screen 16: products saved from a product page, newest first
function ProductsTab({ userId }: { userId: string }) {
  const router = useRouter();
  const { state, retry } = useUserProducts(userId);
  if (state.status === 'loading') return <LoadingState label={savedCopy.productsLoading} />;
  if (state.status === 'error') return <LoadError message={state.message} onRetry={retry} />;
  const saved = state.items.filter((i) => i.saved).map((i) => ({ item: i, product: findProduct(i.productId), partner: partnerFromRef(i.productId) }));
  if (saved.length === 0) {
    return <EmptyState title={savedCopy.productsEmptyTitle} body={savedCopy.productsEmptyBody} />;
  }
  return (
    <View style={styles.list}>
      {saved.map(({ item, product, partner }) =>
        partner ? (
          <ListRow
            key={item.productId}
            label={partner.name}
            detail={`${partner.brand} · ${savedCopy.partnerTag}`}
            leading={<ArtTile art={partner.image} />}
            onPress={() => router.push({ pathname: '/shop/product/[id]', params: { id: partner.id } })}
          />
        ) : product ? (
          <ListRow
            key={product.id}
            label={product.name}
            detail={item.owned ? `${product.brand} · ${savedCopy.ownedTag}` : product.brand}
            leading={<ProductThumb product={product} />}
            onPress={() => router.push(`/explore/product/${product.id}`)}
          />
        ) : null,
      )}
    </View>
  );
}

// Prototype screen 17: products they own, each with "How is it working for you?"
function OwnedTab({ userId }: { userId: string }) {
  const router = useRouter();
  const { state, retry, update, actionError } = useUserProducts(userId);
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const addButton = <Button label={savedCopy.addOwned} style="secondary" onPress={() => router.navigate('/explore')} />;
  if (state.status === 'loading') return <LoadingState label={savedCopy.productsLoading} />;
  if (state.status === 'error') return <LoadError message={state.message} onRetry={retry} />;
  const owned = state.items.filter((i) => i.owned);
  if (owned.length === 0) {
    return (
      <>
        {addButton}
        <EmptyState title={savedCopy.ownedEmptyTitle} body={savedCopy.ownedEmptyBody} />
      </>
    );
  }

  async function reflect(productId: string, reflection: Reflection) {
    setToast('');
    if (await update(productId, { reflection })) setToast(savedCopy.reflectionSaved);
  }

  return (
    <>
      {addButton}
      <Text style={styles.intro}>{savedCopy.ownedCount(owned.length)}</Text>
      {toast ? <Toast type="success" message={toast} /> : null}
      {actionError ? <Toast type="error" message={actionError} /> : null}
      <View style={styles.list}>
        {owned.map((item) => {
          const product = findProduct(item.productId);
          if (!product) return null;
          const isOpen = open === product.id;
          return (
            <View key={product.id} style={styles.ownedCard}>
              <Pressable
                onPress={() => router.push(`/explore/product/${product.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`${savedCopy.viewProduct}: ${product.name}`}
                style={styles.ownedHead}
              >
                <ProductThumb product={product} />
                <View style={styles.cardText}>
                  <Text style={styles.cardMeta}>{product.brand}</Text>
                  <Text style={styles.cardTitle}>{product.name}</Text>
                </View>
                <Icon name="arrow" size={sizes.icon.medium} color={c.accent} />
              </Pressable>
              <Pressable
                onPress={() => setOpen(isOpen ? null : product.id)}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                accessibilityLabel={item.reflection ? savedCopy.reflections[item.reflection] : savedCopy.addReflection}
                style={styles.reflectToggle}
              >
                <Text style={item.reflection ? styles.cardMeta : styles.reflectLink}>
                  {item.reflection ? savedCopy.reflections[item.reflection] : savedCopy.addReflection}
                </Text>
              </Pressable>
              {isOpen ? (
                <View style={styles.reflectBox}>
                  <Text style={styles.cardTitle}>{savedCopy.reflectionQuestion}</Text>
                  <View style={styles.chips}>
                    {(Object.keys(savedCopy.reflections) as Reflection[]).map((key) => (
                      <Chip
                        key={key}
                        label={savedCopy.reflections[key]}
                        state={item.reflection === key ? 'selected' : 'default'}
                        onPress={() => reflect(product.id, key)}
                      />
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </>
  );
}

// Pinterest-style boards (Nov 17), in place of Routines: a two-column grid of covers made from each board's newest pins
function BoardsTab({ userId }: { userId: string }) {
  const router = useRouter();
  const { state, retry, reload } = useBoards(userId);
  const saved = useSavedResults(userId);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function create() {
    setBusy(true);
    setError('');
    const made = await createBoard(userId, name);
    setBusy(false);
    if (!made.ok) {
      setError(made.message);
      return;
    }
    setCreating(false);
    setName('');
    setTouched(false);
    reload();
    router.push({ pathname: '/saved/board/[id]', params: { id: made.id } });
  }

  if (state.status === 'loading') return <LoadingState label={savedCopy.boardsLoading} />;
  if (state.status === 'error') return <LoadError message={state.message} onRetry={retry} />;
  const resultNames = saved.state.status === 'ready' ? Object.fromEntries(saved.state.results.map((r) => [r.id, r.name])) : {};

  return (
    <>
      <Text style={styles.intro}>{savedCopy.boardsIntro}</Text>
      <Button label={savedCopy.createBoard} style="secondary" onPress={() => setCreating(true)} />
      {state.boards.length === 0 ? (
        <EmptyState title={savedCopy.boardsEmptyTitle} body={savedCopy.boardsEmptyBody} />
      ) : (
        <View style={styles.boardGrid}>
          {state.boards.map((board) => {
            const covers = board.pins
              .map((pin) => pinView(pin.kind, pin.ref, resultNames[pin.ref]))
              .filter((v): v is NonNullable<typeof v> => Boolean(v))
              .slice(0, 4);
            return (
              <Pressable
                key={board.id}
                onPress={() => router.push({ pathname: '/saved/board/[id]', params: { id: board.id } })}
                accessibilityRole="button"
                accessibilityLabel={`${board.name}, ${savedCopy.pinCount(board.pins.length)}`}
                style={styles.boardCard}
              >
                <View style={styles.cover}>
                  {[0, 1, 2, 3].map((n) => (
                    <View key={n} style={styles.coverCell}>
                      {covers[n] ? (
                        <Image source={covers[n].image} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
                      ) : null}
                    </View>
                  ))}
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {board.name}
                </Text>
                <Text style={styles.cardMeta}>{savedCopy.pinCount(board.pins.length)}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
      <Sheet visible={creating} title={savedCopy.newBoard} onClose={() => setCreating(false)}>
        <View style={styles.sheetBody}>
          <TextInput
            label={savedCopy.boardName}
            helper={savedCopy.boardNameHelper}
            value={name}
            onChangeText={setName}
            onBlur={() => setTouched(true)}
            error={touched && !name.trim() ? savedCopy.boardNameError : error || undefined}
            maxLength={60}
          />
          <Button label={savedCopy.create} state={name.trim() ? undefined : 'disabled'} loading={busy} onPress={create} />
        </View>
      </Sheet>
    </>
  );
}

function SavedResultCard({ result, onPress }: { result: SavedResult; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Open saved result: ${result.name}`}>
      {({ pressed }) => (
        <View style={[styles.card, pressed && styles.cardPressed]}>
          <View style={styles.tile}>
            <Icon name="saved" size={sizes.icon.large} color={c.ink} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{result.name}</Text>
            <Text style={styles.cardMeta}>{savedCopy.resultLine(savedDateLabel(result.savedAt))}</Text>
            <View style={styles.savedTag}>
              <Text style={styles.savedTagText}>{savedCopy.savedTag}</Text>
            </View>
          </View>
          <Icon name="arrow" size={sizes.icon.medium} color={c.accent} />
        </View>
      )}
    </Pressable>
  );
}

function EmptyState({ title, body, action }: { title: string; body: string; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon name="saved" size={sizes.icon.large} color={c.ink} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      {action ? <Button label={action.label} onPress={action.onPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...type.heading,
    color: c.ink,
  },
  tabs: {
    marginHorizontal: -layout.screenEdge,
    paddingHorizontal: space[8],
  },
  intro: {
    ...type.caption,
    color: c.ink,
  },
  list: {
    gap: space[12],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  cardPressed: {
    backgroundColor: c.background,
  },
  tile: {
    width: space[48],
    height: space[48],
    borderRadius: radius.small,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.successSurface,
  },
  cardText: {
    flex: 1,
    gap: space[4],
  },
  cardTitle: {
    ...type.label,
    color: c.ink,
  },
  cardMeta: {
    ...type.caption,
    color: c.inkMuted,
  },
  savedTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: space[8],
    paddingVertical: space[4],
    borderRadius: radius.pill,
    backgroundColor: c.successSurface,
  },
  savedTagText: {
    ...type.caption,
    color: c.success,
  },
  boardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: space[16],
  },
  boardCard: {
    width: '48%',
    gap: space[4],
  },
  // Four newest pins in a square collage, like a Pinterest board cover
  cover: {
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: stroke.strong,
    borderRadius: radius.medium,
    overflow: 'hidden',
    marginBottom: space[4],
    backgroundColor: c.surface,
  },
  coverCell: {
    width: '49%',
    height: '49%',
    backgroundColor: c.surfaceWarm,
    overflow: 'hidden',
  },
  sheetBody: {
    gap: space[12],
  },
  ownedCard: {
    gap: space[8],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  ownedHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  reflectToggle: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  reflectLink: {
    ...type.label,
    color: c.accent,
  },
  reflectBox: {
    gap: space[8],
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[8],
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[12],
    paddingVertical: space[48],
  },
  emptyIcon: {
    width: space[48] + space[8],
    height: space[48] + space[8],
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.surfaceWarm,
  },
  emptyTitle: {
    ...type.title,
    fontFamily: type.heading.fontFamily,
    color: c.ink,
  },
  emptyBody: {
    ...type.body,
    color: c.inkMuted,
    textAlign: 'center',
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
