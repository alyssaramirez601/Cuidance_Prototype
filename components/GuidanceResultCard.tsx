import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, layout, letterSpacing, radius, sizes, space, stroke, type } from '@/constants/tokens';

type GuidanceResultCardProps = {
  eyebrow: string;
  headline: string;
  subtitle: string;
  onWhyPress: () => void;
};

// Result copy comes from docs/quiz-outcomes/, so every line arrives as a prop
export function GuidanceResultCard({ eyebrow, headline, subtitle, onWhyPress }: GuidanceResultCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.headline} accessibilityRole="header">
        {headline}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Pressable
        onPress={onWhyPress}
        accessibilityRole="link"
        accessibilityLabel="Why this fits you"
        style={styles.link}
      >
        <Text style={styles.linkLabel}>Why this fits you</Text>
        <Icon name="arrow" size={sizes.icon.medium} color={colors.light.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space[12],
    padding: space[24],
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  eyebrow: {
    ...type.label,
    color: colors.light.highlight,
    // Written in normal case, shown in caps. Only short eyebrow labels may do this
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  headline: {
    ...type.heading,
    color: colors.light.ink,
  },
  subtitle: {
    ...type.body,
    color: colors.light.inkMuted,
  },
  link: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  linkLabel: {
    ...type.label,
    color: colors.light.accent,
  },
});
