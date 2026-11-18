import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@/constants/tokens';
import type { Product } from '@/data/products';
import { productImage } from '@/lib/explore';

type ProductMiniCardProps = {
  product: Product;
  // The short line under the picture, like "Face moisturizer"
  label: string;
  onPress: () => void;
};

// The small picture-and-label card in swipeable rows (Explore's and Home's "For you"),
// like Sephora's "Continue Shopping" row
export function ProductMiniCard({ product, label, onPress }: ProductMiniCardProps) {
  const image = productImage(product);
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${product.brand} ${product.name}`} style={styles.card}>
      <View style={styles.art}>
        <Image
          source={image.source}
          style={image.kind === 'scene' ? StyleSheet.absoluteFill : styles.arch}
          contentFit={image.kind === 'scene' ? 'cover' : 'contain'}
          accessible={false}
        />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: space[48] * 2,
    gap: space[8],
  },
  art: {
    height: space[48] * 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.medium,
    backgroundColor: colors.light.surfaceWarm,
  },
  arch: {
    width: '75%',
    height: '85%',
  },
  label: {
    ...type.caption,
    color: colors.light.ink,
    textAlign: 'center',
  },
});
