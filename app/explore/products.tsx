import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { ListRow } from '@/components/ListRow';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { ProductThumb } from '@/components/ProductThumb';
import { Screen } from '@/components/Screen';
import { colors, layout, space, type } from '@/constants/tokens';
import { departments, findCategory, findDepartment } from '@/data/categories';
import { productsCopy } from '@/data/exploreCopy';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { productsFor } from '@/lib/explore';
import { pickedAreas } from '@/lib/quizFlow';

const c = colors.light;

type Params = { department?: string; category?: string; sub?: string; forYou?: string };

// Prototype screen 09, with Ulta- and Sephora-style departments, categories and subcategories.
// The choice lives in the link (params), so Back and refresh keep the same filter
export default function ProductsScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={productsCopy.title} />;
  return <ProductsContent userId={session.user.id} />;
}

function ProductsContent({ userId }: { userId: string }) {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const { state } = useProfileData(userId);
  const forYou = params.forYou === '1';
  const department = findDepartment(params.department);
  const category = findCategory(params.department, params.category);

  const areas = state.status === 'ready' ? pickedAreas(state.data.answers) : [];
  const list = forYou
    ? productsFor({ areas })
    : productsFor({ department: department?.id, category: category?.id, sub: params.sub || undefined });

  const set = (next: Params) => router.setParams({ department: undefined, category: undefined, sub: undefined, forYou: undefined, ...next });

  return (
    <Screen>
      <PageHeader title={productsCopy.title} backTo="/explore" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow} style={styles.bleed}>
        <Chip label={productsCopy.forYou} state={forYou ? 'selected' : 'default'} onPress={() => set({ forYou: '1' })} />
        <Chip label={productsCopy.all} state={!forYou && !department ? 'selected' : 'default'} onPress={() => set({})} />
        {departments.map((d) => (
          <Chip key={d.id} label={d.label} state={department?.id === d.id ? 'selected' : 'default'} onPress={() => set({ department: d.id })} />
        ))}
      </ScrollView>

      {department && !forYou ? (
        <View style={styles.wrap}>
          <Chip label={productsCopy.all} state={!category ? 'selected' : 'default'} onPress={() => set({ department: department.id })} />
          {department.categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              state={category?.id === cat.id ? 'selected' : 'default'}
              onPress={() => set({ department: department.id, category: cat.id })}
            />
          ))}
        </View>
      ) : null}

      {category && category.subs.length && !forYou ? (
        <View style={styles.wrap}>
          {category.subs.map((sub) => (
            <Chip
              key={sub.id}
              label={sub.label}
              state={params.sub === sub.id ? 'selected' : 'default'}
              onPress={() =>
                set({ department: department?.id, category: category.id, sub: params.sub === sub.id ? undefined : sub.id })
              }
            />
          ))}
        </View>
      ) : null}

      {forYou ? <Text style={styles.note}>{areas.length ? productsCopy.forYouNote : productsCopy.forYouEmpty}</Text> : null}

      {state.status === 'loading' && forYou ? (
        <LoadingState label={productsCopy.title} />
      ) : list.length === 0 ? (
        forYou && !areas.length ? null : <Text style={styles.empty}>{productsCopy.categoryEmpty}</Text>
      ) : (
        <View style={styles.list}>
          {list.map((product) => (
            <ListRow
              key={product.id}
              label={product.name}
              detail={`${product.brand} · ${product.type}`}
              leading={<ProductThumb product={product} />}
              onPress={() => router.push(`/explore/product/${product.id}`)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  // A sideways scroll row inside the page's scroll grows to fill the screen unless told not to
  bleed: {
    marginHorizontal: -layout.screenEdge,
    flexGrow: 0,
    flexShrink: 0,
  },
  chipRow: {
    gap: space[8],
    paddingHorizontal: layout.screenEdge,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[8],
  },
  note: {
    ...type.caption,
    color: c.inkMuted,
  },
  empty: {
    ...type.body,
    color: c.inkMuted,
  },
  list: {
    gap: space[8],
  },
  art: {
    width: space[32] + space[8],
    height: space[48],
  },
});
