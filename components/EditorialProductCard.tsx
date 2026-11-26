import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { ArtFrame } from '@/components/ArtFrame';
import { Icon } from '@/components/Icon';
import { layout, letterSpacing, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { usePressBounce } from '@/hooks/useMotion';
import { makeStyles, useColors } from '@/hooks/useTheme';
import type { Product } from '@/data/products';
import { isFocused } from '@/lib/focus';
import { productImage } from '@/lib/explore';

type EditorialProductCardProps = {
  product: Product;
  onPress: () => void;
};

// The larger, featured product (Home v2, Nov 25): its art in a frame, the plain product type as an
// eyebrow, the brand and a Newsreader name. Only real product facts, no claims about fit
export function EditorialProductCard({ product, onPress }: EditorialProductCardProps) {
  const styles = useStyles();
  const c = useColors();
  const image = productImage(product);
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.98);
  return (
    <Animated.View style={bounceStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`${product.type}. ${product.brand} ${product.name}`}
        style={(state) => [styles.card, isFocused(state) && styles.focused]}
      >
        <ArtFrame source={image.source} fit={image.kind === 'scene' ? 'cover' : 'contain'} style={styles.art} />
        <View style={styles.text}>
          <Text style={styles.eyebrow}>{product.type}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.brand}>{product.brand}</Text>
        </View>
        <Icon name="arrow" size={sizes.icon.medium} color={c.accent} />
      </Pressable>
    </Animated.View>
  );
}

const useStyles = makeStyles((c, g) => StyleSheet.create({
  card: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
    padding: space[12],
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
    boxShadow: g.shadowLift,
  },
  focused: {
    outlineColor: c.accent,
    outlineStyle: 'solid',
    outlineWidth: stroke.strong,
  },
  art: {
    width: space[48] * 2 + space[24],
    aspectRatio: 1,
  },
  text: {
    flex: 1,
    gap: space[4],
  },
  eyebrow: {
    ...type.eyebrow,
    color: c.highlight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  name: {
    ...type.editorialTitle,
    color: c.ink,
  },
  brand: {
    ...type.caption,
    color: c.inkMuted,
  },
}));
