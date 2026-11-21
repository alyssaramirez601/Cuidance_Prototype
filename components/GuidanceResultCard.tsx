import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { layout, letterSpacing, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { makeStyles, useColors } from '@/hooks/useTheme';

type GuidanceResultCardProps = {
  eyebrow: string;
  headline: string;
  subtitle: string;
  onWhyPress: () => void;
};

// Result copy comes from docs/quiz-outcomes/, so every line arrives as a prop
export function GuidanceResultCard({ eyebrow, headline, subtitle, onWhyPress }: GuidanceResultCardProps) {
  const styles = useStyles();
  const c = useColors();
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
        <Icon name="arrow" size={sizes.icon.medium} color={c.accent} />
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  card: {
    gap: space[12],
    padding: space[24],
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  eyebrow: {
    ...type.label,
    color: c.highlight,
    // Written in normal case, shown in caps. Only short eyebrow labels may do this
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  headline: {
    ...type.heading,
    color: c.ink,
  },
  subtitle: {
    ...type.body,
    color: c.inkMuted,
  },
  link: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  linkLabel: {
    ...type.label,
    color: c.accent,
  },
}));
