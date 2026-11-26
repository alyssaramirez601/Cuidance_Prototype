import { Image } from 'expo-image';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { DisclosureLabel } from '@/components/DisclosureLabel';
import { Icon } from '@/components/Icon';
import { layout, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { usePressBounce } from '@/hooks/useMotion';
import { makeStyles, useColors } from '@/hooks/useTheme';
import { isFocused } from '@/lib/focus';

type PartnerHighlightCardProps = {
  brand: string;
  name: string;
  // Leave out for the neutral placeholder tile
  image?: number;
  onPress: () => void;
};

// "Partner Highlight Card" from the Week 8 Step 4 component kit. Always labeled Partner content.
// Home v2 (Nov 25): wide enough that the label stays on one line, a square art window with a
// straight top (guidance art uses arches, so commerce looks different), and a soft lift.
// Not in docs/design-system/components.md yet, so Esme should add it
export function PartnerHighlightCard({ brand, name, image, onPress }: PartnerHighlightCardProps) {
  const styles = useStyles();
  const c = useColors();
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.96);
  return (
    <Animated.View style={bounceStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`Partner content: ${brand}, ${name}`}
        style={(state) => [styles.card, isFocused(state) && styles.focused]}
      >
        {image ? (
          <Image source={image} style={styles.image} contentFit="cover" accessible={false} />
        ) : (
          <View style={styles.image}>
            <Icon name="shop" size={sizes.icon.large} color={c.inkMuted} />
          </View>
        )}
        <DisclosureLabel type="partner" />
        <Text style={styles.brand}>{brand}</Text>
        <Text style={styles.name}>{name}</Text>
      </Pressable>
    </Animated.View>
  );
}

const useStyles = makeStyles((c, g) => StyleSheet.create({
  card: {
    // Slightly smaller than a product card, so partner content stays lighter than guidance
    width: space[48] * 3,
    minHeight: layout.minTouchTarget,
    gap: space[4],
    padding: space[8],
    borderRadius: radius.medium,
    backgroundColor: c.surface,
    boxShadow: g.shadowLift,
  },
  focused: {
    outlineColor: c.accent,
    outlineStyle: 'solid',
    outlineWidth: stroke.strong,
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
    ...type.label,
    color: c.ink,
  },
}));
