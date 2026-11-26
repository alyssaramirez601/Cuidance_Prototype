import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { ListRow } from '@/components/ListRow';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { ProductThumb } from '@/components/ProductThumb';
import { Screen } from '@/components/Screen';
import { Tabs } from '@/components/Tabs';
import { layout, space, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';
import { departments, findCategory, findDepartment } from '@/data/categories';
import { productsCopy } from '@/data/exploreCopy';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { productsFor } from '@/lib/explore';
import { pickedAreas } from '@/lib/quizFlow';

type Params = { department?: string; category?: string; sub?: string; forYou?: string };

// Prototype screen 09, with Ulta- and Sephora-style departments, categories and subcategories.
// The choice lives in the link (params), so Back and refresh keep the same filter
export default function ProductsScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={productsCopy.title} />;
  return <ProductsContent userId={session.user.id} />;
}

function ProductsContent({ userId }: { userId: string }) {
  const styles = useStyles();
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

      <View style={styles.bleed}>
        <Tabs
          scrollable
          tabs={[
            { key: 'foryou', label: productsCopy.forYou },
            { key: 'all', label: productsCopy.all },
            ...departments.map((d) => ({ key: d.id, label: d.short })),
          ]}
          activeKey={forYou ? 'foryou' : (department?.id ?? 'all')}
          onChange={(key) => (key === 'foryou' ? set({ forYou: '1' }) : key === 'all' ? set({}) : set({ department: key }))}
        />
      </View>

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

const useStyles = makeStyles((c) => StyleSheet.create({
  // A sideways scroll row inside the page's scroll grows to fill the screen unless told not to
  bleed: {
    marginHorizontal: -layout.screenEdge,
    flexGrow: 0,
    flexShrink: 0,
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
}));
