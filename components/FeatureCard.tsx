import type { ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Icon } from '@/components/Icon';
import { layout, letterSpacing, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { usePressBounce } from '@/hooks/useMotion';
import { makeStyles, useColors } from '@/hooks/useTheme';
import { isFocused } from '@/lib/focus';

type FeatureCardProps = {
  title: string;
  onPress: () => void;
  eyebrow?: string;
  body?: string;
  // The words on the pill. Leave out for an arrow only
  actionLabel?: string;
  // The picture region. Sits beside the text (or above it at large text sizes), never under it
  art?: ReactNode;
};

// Text size where the art moves above the text so the words keep their width
const STACK_AT_FONT_SCALE = 1.3;

// The large editorial feature (Home v2, Nov 25): a surface that stays deep green in both modes,
// a Newsreader headline and one clear action. The whole card is one button, so screen readers hear
// the headline and the action together. Built to be reused by the result and Saved later
export function FeatureCard({ title, onPress, eyebrow, body, actionLabel, art }: FeatureCardProps) {
  const styles = useStyles();
  const c = useColors();
  const { fontScale } = useWindowDimensions();
  const stacked = fontScale >= STACK_AT_FONT_SCALE;
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
        <View style={[styles.top, stacked && styles.stacked]}>
          {art ? <View style={[styles.art, stacked && styles.artStacked]}>{art}</View> : null}
          <View style={styles.text}>
            {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
            <Text style={styles.title}>{title}</Text>
            {body ? <Text style={styles.body}>{body}</Text> : null}
          </View>
        </View>
        {/* Below both columns, so the label always has the card's full width */}
        <View style={[styles.action, !actionLabel && styles.actionRound]}>
          {actionLabel ? <Text style={styles.actionText}>{actionLabel}</Text> : null}
          <Icon name="arrow" size={sizes.icon.medium} color={c.featureSurface} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const useStyles = makeStyles((c, g) => StyleSheet.create({
  card: {
    gap: space[16],
    padding: space[24],
    overflow: 'hidden',
    borderRadius: radius.medium,
    backgroundColor: c.featureSurface,
    boxShadow: g.shadowPaper,
  },
  // Art first in the markup so it can sit above the text when stacked; row-reverse keeps it on the right
  top: {
    flexDirection: 'row-reverse',
    gap: space[16],
  },
  stacked: {
    flexDirection: 'column',
  },
  focused: {
    outlineColor: c.accent,
    outlineStyle: 'solid',
    outlineWidth: stroke.strong,
    outlineOffset: stroke.strong,
  },
  text: {
    flex: 1,
    gap: space[8],
  },
  art: {
    width: space[48] * 2,
    justifyContent: 'center',
  },
  artStacked: {
    width: '100%',
    alignItems: 'flex-start',
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
  // Looks like a pill button; the whole card is the real button
  action: {
    minHeight: layout.minTouchTarget,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
    paddingHorizontal: space[16],
    borderRadius: radius.pill,
    backgroundColor: c.onFeature,
  },
  actionRound: {
    width: layout.minTouchTarget,
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  actionText: {
    ...type.label,
    color: c.featureSurface,
  },
}));
