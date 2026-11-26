import { Image } from 'expo-image';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, space, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';
import { usePressBounce } from '@/hooks/useMotion';
import type { Product } from '@/data/products';
import { productImage } from '@/lib/explore';

type ProductMiniCardProps = {
  product: Product;
  // The line under the picture: the product name
  label: string;
  onPress: () => void;
};

// The small picture-and-label card in swipeable rows (Explore's and Home's "For you"),
// like Sephora's "Continue Shopping" row
export function ProductMiniCard({ product, label, onPress }: ProductMiniCardProps) {
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.96);
  const styles = useStyles();
  const image = productImage(product);
  return (
    <Animated.View style={bounceStyle}>
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} accessibilityRole="button" accessibilityLabel={`${product.brand} ${product.name}`} style={styles.card}>
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
    </Animated.View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  // Wide enough for a two-line product name
  card: {
    width: space[48] * 2 + space[24],
    gap: space[8],
  },
  art: {
    aspectRatio: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.medium,
    backgroundColor: c.surfaceWarm,
  },
  arch: {
    width: '75%',
    height: '85%',
  },
  label: {
    ...type.caption,
    color: c.ink,
    textAlign: 'center',
  },
}));
