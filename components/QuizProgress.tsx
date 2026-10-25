import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@/constants/tokens';

type QuizProgressProps = {
  // The exact label from the quiz content doc, for example "Getting started · 3 of 4"
  label: string;
  current: number;
  total: number;
};

export function QuizProgress({ label, current, total }: QuizProgressProps) {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={label}>
      <Text style={styles.label}>{label}</Text>
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
  label: {
    ...type.body,
    color: colors.light.inkMuted,
  },
  track: {
    height: space[8],
    borderRadius: radius.pill,
    backgroundColor: colors.light.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.light.selected,
  },
});
