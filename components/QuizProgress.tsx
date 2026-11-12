import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, sizes, space, type } from '@/constants/tokens';

type QuizProgressProps = {
  // The exact label from docs/quiz-outcomes/01-quiz-content.md, for example "Getting started · 3 of 4"
  label: string;
  current: number;
  total: number;
};

export function QuizProgress({ label, current, total }: QuizProgressProps) {
  // "Getting started · 1 of 4" shows as the section name with the count beside it, like the Week 8 hi-fi
  const splitAt = label.lastIndexOf(' · ');
  const section = splitAt === -1 ? label : label.slice(0, splitAt);
  const count = splitAt === -1 ? '' : label.slice(splitAt + 3);

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={label}>
      <View style={styles.labelRow}>
        <Text style={styles.section}>{section}</Text>
        {count ? <Text style={styles.count}>{count}</Text> : null}
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(current / total) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space[8],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: space[12],
  },
  section: {
    ...type.title,
    flexShrink: 1,
    color: colors.light.ink,
  },
  count: {
    ...type.caption,
    color: colors.light.inkMuted,
  },
  track: {
    height: sizes.progressTrackHeight,
    borderRadius: radius.pill,
    backgroundColor: colors.light.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.light.accent,
  },
});
