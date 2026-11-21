import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { layout, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

type ProductCardProps = {
  name: string;
  // Optional because guidance never names real brands. Partner content is labeled separately
  brand?: string;
  fitLabel: string;
  onPress: () => void;
  // Leave out for the plain placeholder. Explore passes an illustration until real photos are cleared
  image?: ImageSource | number;
};

export function ProductCard({ name, brand, fitLabel, onPress, image }: ProductCardProps) {
  const styles = useStyles();
  return (
    <View style={styles.card}>
      <View style={styles.image}>
        {image ? <Image source={image} style={styles.imageFill} contentFit="contain" accessible={false} /> : null}
      </View>
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

const useStyles = makeStyles((c) => StyleSheet.create({
  card: {
    width: sizes.productCardWidth,
    gap: space[8],
    padding: space[12],
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  image: {
    width: sizes.productImageWidth,
    height: sizes.productImageHeight,
    borderRadius: radius.small,
    backgroundColor: c.surfaceWarm,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFill: {
    width: '80%',
    height: '90%',
  },
  text: {
    gap: space[4],
  },
  brand: {
    ...type.caption,
    color: c.inkMuted,
  },
  name: {
    ...type.label,
    color: c.ink,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingVertical: space[4],
    paddingHorizontal: space[8],
    borderRadius: radius.small,
    backgroundColor: c.successSurface,
  },
  tagLabel: {
    ...type.caption,
    color: c.ink,
  },
  link: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  linkLabel: {
    ...type.label,
    color: c.accent,
  },
}));
