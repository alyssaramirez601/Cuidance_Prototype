import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { radius, space } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';
import type { Product } from '@/data/products';
import { productImage } from '@/lib/explore';

// The small product picture at the start of a product row. Square scene art fills the tile;
// arch art sits inside it. Decoration only, since the row already reads the product name
export function ProductThumb({ product }: { product: Product }) {
  const styles = useStyles();
  const image = productImage(product);
  return (
    <View style={styles.tile}>
      <Image
        source={image.source}
        style={image.kind === 'scene' ? StyleSheet.absoluteFill : styles.arch}
        contentFit={image.kind === 'scene' ? 'cover' : 'contain'}
        accessible={false}
      />
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  tile: {
    width: space[48],
    height: space[48],
    borderRadius: radius.small,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.surfaceWarm,
  },
  arch: {
    width: space[32] + space[4],
    height: space[48] - space[8],
  },
}));
