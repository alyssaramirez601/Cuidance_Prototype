import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DisclosureLabel } from '@/components/DisclosureLabel';
import { Icon } from '@/components/Icon';
import { colors, layout, radius, sizes, space, type } from '@/constants/tokens';

type PartnerHighlightCardProps = {
  brand: string;
  name: string;
  onPress: () => void;
};

const c = colors.light;

// "Partner Highlight Card" from the Week 8 Step 4 component kit. Always labeled Partner content.
// The image is a neutral placeholder until partner photography exists (the design flags photos as open).
// Not in docs/design-system/components.md yet, so Esme should add it
export function PartnerHighlightCard({ brand, name, onPress }: PartnerHighlightCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Partner content: ${name}`} style={styles.card}>
      <View style={styles.image}>
        <Icon name="shop" size={sizes.icon.large} color={c.inkMuted} />
      </View>
      <DisclosureLabel type="partner" />
      <Text style={styles.brand}>{brand}</Text>
      <Text style={styles.name}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    gap: space[4],
    padding: space[8],
    borderRadius: radius.medium,
    backgroundColor: c.surface,
  },
  image: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.small,
    backgroundColor: c.disabledSurface,
    marginBottom: space[4],
  },
  brand: {
    ...type.caption,
    color: c.inkMuted,
  },
  name: {
    ...type.caption,
    fontFamily: type.label.fontFamily,
    color: c.ink,
  },
});
