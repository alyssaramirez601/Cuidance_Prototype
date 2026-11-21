import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { letterSpacing, radius, sizes, space, type } from '@/constants/tokens';
import { useNativeDriver, useReducedMotion } from '@/hooks/useMotion';
import { makeStyles } from '@/hooks/useTheme';

type QuizProgressProps = {
  // The exact label from docs/quiz-outcomes/01-quiz-content.md, for example "Getting started · 3 of 4"
  label: string;
  current: number;
  total: number;
};

// Redesign (Nov 20): direction B's layout with direction A's colors. The step number sits large in
// Care Terracotta beside the section name, and the bar fills in terracotta with a little spring
export function QuizProgress({ label, current, total }: QuizProgressProps) {
  const styles = useStyles();
  const reduced = useReducedMotion();
  const [fill] = useState(() => new Animated.Value(reduced ? current / total : Math.max(0, (current - 1) / total)));
  const splitAt = label.lastIndexOf(' · ');
  const section = splitAt === -1 ? label : label.slice(0, splitAt);
  const count = splitAt === -1 ? '' : label.slice(splitAt + 3);
  const ofTotal = count.replace(/^\d+\s*/, '');

  useEffect(() => {
    const to = current / total;
    if (reduced) {
      fill.setValue(to);
      return;
    }
    Animated.spring(fill, { toValue: to, delay: 150, speed: 8, bounciness: 8, useNativeDriver }).start();
  }, [current, total, fill, reduced]);

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: total, now: current }}
    >
      <View style={styles.labelRow}>
        <Text style={styles.number}>{current}</Text>
        <Text style={styles.section}>
          {ofTotal ? `${ofTotal} · ` : ''}
          {section}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { transform: [{ scaleX: fill }] }]} />
      </View>
    </View>
  );
}

const useStyles = makeStyles((c, g) =>
  StyleSheet.create({
    container: {
      gap: space[8],
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: space[8],
    },
    number: {
      ...type.display,
      color: c.highlight,
    },
    section: {
      ...type.label,
      flexShrink: 1,
      color: c.ink,
      textTransform: 'uppercase',
      letterSpacing: letterSpacing.eyebrow,
    },
    track: {
      height: sizes.progressTrackHeight,
      borderRadius: radius.pill,
      backgroundColor: c.border,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      width: '100%',
      borderRadius: radius.pill,
      backgroundColor: g.terracottaBold,
      transformOrigin: 'left',
    },
  }),
);
