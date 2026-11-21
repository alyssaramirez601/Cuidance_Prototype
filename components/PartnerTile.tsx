import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DisclosureLabel } from '@/components/DisclosureLabel';
import { letterSpacing, radius, space, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

type PartnerTileProps = {
  title: string;
  image: number;
  onPress: () => void;
  // A small line under the title, like a brand or a date
  detail?: string;
  // A kind above the title, like "Partner workshop"
  eyebrow?: string;
  // row: a fixed-width square tile for a swipe row. grid: a square that fills its column.
  // banner: a full-width card for lists, art on the left and words on the right
  layout?: 'row' | 'grid' | 'banner';
};

// A picture tile for partner products, collections and workshops. Always labeled Partner content
export function PartnerTile({ title, image, onPress, detail, eyebrow, layout = 'row' }: PartnerTileProps) {
  const styles = useStyles();
  const words = (
    <>
      <DisclosureLabel type="partner" />
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </>
  );
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Partner content: ${title}`}
      style={[styles.tile, layout === 'row' ? styles.narrow : null, layout === 'banner' ? styles.banner : null]}
    >
      <Image source={image} style={layout === 'banner' ? styles.bannerArt : styles.art} contentFit="cover" accessible={false} />
      {layout === 'banner' ? <View style={styles.bannerWords}>{words}</View> : words}
    </Pressable>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  tile: {
    gap: space[4],
  },
  narrow: {
    width: space[48] * 3,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
    padding: space[12],
    borderRadius: radius.medium,
    backgroundColor: c.surface,
  },
  bannerArt: {
    width: space[48] * 2,
    aspectRatio: 1,
    borderRadius: radius.small,
    backgroundColor: c.surfaceWarm,
  },
  bannerWords: {
    flex: 1,
    gap: space[4],
  },
  art: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.medium,
    marginBottom: space[4],
    backgroundColor: c.surfaceWarm,
  },
  eyebrow: {
    ...type.caption,
    fontFamily: type.label.fontFamily,
    color: c.highlight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  title: {
    ...type.label,
    color: c.ink,
  },
  detail: {
    ...type.caption,
    color: c.inkMuted,
  },
}));
