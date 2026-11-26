import type { ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { layout, letterSpacing, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { usePressBounce } from '@/hooks/useMotion';
import { makeStyles, useColors } from '@/hooks/useTheme';
import { isFocused } from '@/lib/focus';

type FeatureCardProps = {
  title: string;
  onPress: () => void;
  actionLabel: string;
  eyebrow?: string;
  body?: string;
  // The picture slot. It sits in the bottom-right corner beside the action, never under text
  art?: ReactNode;
  // Width / height of the art slot, from data/homeArt.ts
  artRatio?: number;
};

// The large editorial feature (Home v2, refined Nov 25): a surface that stays deep green in both
// modes. The headline and description use the card's full width so they stay easy to read; the
// artwork gets its own corner beside the action and runs to the card's edges. The whole card is one
// button, so screen readers hear the headline and the action together. Built to be reused later
export function FeatureCard({ title, onPress, actionLabel, eyebrow, body, art, artRatio = 1 }: FeatureCardProps) {
  const styles = useStyles();
  const c = useColors();
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.98);
  const label = [eyebrow, title, body, actionLabel].filter(Boolean).join('. ');
  return (
    <Animated.View style={bounceStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={(state) => [styles.card, isFocused(state) && styles.focused]}
      >
        <View style={styles.text}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {body ? <Text style={styles.body}>{body}</Text> : null}
        </View>
        {/* Wraps, so at large text sizes the art moves under the action instead of squeezing it */}
        <View style={styles.bottom}>
          <View style={styles.action}>
            <Text style={styles.actionText}>{actionLabel}</Text>
            <Icon name="arrow" size={sizes.icon.medium} color={c.featureSurface} />
          </View>
          {art ? <View style={[styles.art, { aspectRatio: artRatio }]}>{art}</View> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const useStyles = makeStyles((c, g) => StyleSheet.create({
  card: {
    gap: space[16],
    paddingTop: space[24],
    paddingHorizontal: space[24],
    overflow: 'hidden',
    borderRadius: radius.medium,
    backgroundColor: c.featureSurface,
    boxShadow: g.shadowPaper,
  },
  focused: {
    outlineColor: c.accent,
    outlineStyle: 'solid',
    outlineWidth: stroke.strong,
    outlineOffset: stroke.strong,
  },
  text: {
    gap: space[8],
  },
  eyebrow: {
    ...type.eyebrow,
    color: c.featureEyebrow,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  title: {
    ...type.heading,
    color: c.onFeature,
  },
  body: {
    ...type.body,
    color: c.onFeature,
  },
  // The action sits right under the text; the art fills the rest of the row down to the card's corner
  bottom: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    columnGap: space[16],
  },
  // Looks like a pill button; the whole card is the real button
  action: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
    marginBottom: space[24],
    paddingHorizontal: space[16],
    borderRadius: radius.pill,
    backgroundColor: c.onFeature,
  },
  actionText: {
    ...type.label,
    color: c.featureSurface,
  },
  // 288 x 330 art at up to half size, running to the card's right and bottom edges. It shrinks to fit
  // beside the action, and only moves under it when less than 96 px is left (large text sizes)
  art: {
    flexGrow: 1,
    flexBasis: space[48] * 2,
    maxWidth: space[48] * 3,
    marginLeft: 'auto',
    marginRight: -space[24],
  },
}));
