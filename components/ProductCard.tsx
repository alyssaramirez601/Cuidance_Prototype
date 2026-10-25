import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, layout, radius, sizes, space, stroke, type } from '@/constants/tokens';

type ProductCardProps = {
  name: string;
  // Optional because guidance never names real brands. Partner content is labeled separately
  brand?: string;
  fitLabel: string;
  onPress: () => void;
};

export function ProductCard({ name, brand, fitLabel, onPress }: ProductCardProps) {
  return (
    <View style={styles.card}>
      {/* Placeholder until product images exist. expo-image is not installed yet */}
      <View style={styles.image} />
      <View style={styles.text}>
        {brand ? <Text style={styles.brand}>{brand}</Text> : null}
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.tag}>
        <Text style={styles.tagLabel}>{fitLabel}</Text>
      </View>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`View product: ${name}`} style={styles.link}>
        <Text style={styles.linkLabel}>View product</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: sizes.productCardWidth,
    gap: space[8],
    padding: space[12],
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  image: {
    width: sizes.productImageWidth,
    height: sizes.productImageHeight,
    borderRadius: radius.small,
    backgroundColor: colors.light.surfaceWarm,
  },
  text: {
    gap: space[4],
  },
  brand: {
    ...type.caption,
    color: colors.light.inkMuted,
  },
  name: {
    ...type.label,
    color: colors.light.ink,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingVertical: space[4],
    paddingHorizontal: space[8],
    borderRadius: radius.small,
    backgroundColor: colors.light.successSurface,
  },
  tagLabel: {
    ...type.caption,
    color: colors.light.ink,
  },
  link: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  linkLabel: {
    ...type.label,
    color: colors.light.accent,
  },
});
