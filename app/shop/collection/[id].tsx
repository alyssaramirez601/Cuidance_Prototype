import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { DisclosureLabel } from '@/components/DisclosureLabel';
import { PageHeader } from '@/components/PageHeader';
import { PartnerTile } from '@/components/PartnerTile';
import { Screen } from '@/components/Screen';
import { space } from '@/constants/tokens';
import { shopCopy } from '@/data/partnerContent';
import { collectionProducts, findCollection } from '@/lib/shop';

// A partner collection: the partner products a brand grouped together
export default function PartnerCollectionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const collection = findCollection(id);

  if (!collection) {
    return (
      <Screen>
        <PageHeader title={shopCopy.collectionNotFoundTitle} intro={shopCopy.notFoundBody} backTo="/shop" />
        <Button label={shopCopy.backToShop} onPress={() => router.navigate('/shop')} />
      </Screen>
    );
  }

  const items = collectionProducts(collection);
  // Two across, like the product grids on Ulta and Sephora
  const rows = items.reduce<(typeof items)[]>((all, item, i) => {
    if (i % 2 === 0) all.push([item]);
    else all[all.length - 1].push(item);
    return all;
  }, []);

  return (
    <Screen>
      <PageHeader
        title={collection.name}
        intro={shopCopy.collectionCount(items.length, collection.detail)}
        backTo="/shop"
      />
      <DisclosureLabel type="partner" />
      {rows.map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((product) => (
            <View key={product.id} style={styles.cell}>
              <PartnerTile
                layout="grid"
                title={product.name}
                detail={product.brand}
                image={product.image}
                onPress={() => router.push({ pathname: '/shop/product/[id]', params: { id: product.id } })}
              />
            </View>
          ))}
          {row.length === 1 ? <View style={styles.cell} /> : null}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space[12],
  },
  cell: {
    flex: 1,
  },
});
