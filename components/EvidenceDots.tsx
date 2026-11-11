import { StyleSheet, View } from 'react-native';

import { colors, radius, space, stroke } from '@/constants/tokens';
import type { Evidence } from '@/data/outcomeTypes';
import { evidenceKey } from '@/data/draftCopy';

// How many of the three dots fill in. The count carries the meaning, so color is never the only signal
const filled: Record<Evidence, number> = { Strong: 3, Moderate: 2, Limited: 1, Assumption: 0 };
const DOT = space[8];

const c = colors.light;

// A small marker, like a menu's "vegetarian" icon. The key in "Evidence and sources" explains it
export function EvidenceDots({ evidence }: { evidence: Evidence }) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`Evidence: ${evidenceKey[evidence].title}`}>
      {[0, 1, 2].map((index) => (
        <View key={index} style={[styles.dot, index < filled[evidence] ? styles.on : styles.off]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space[4],
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: radius.pill,
    borderWidth: stroke.default,
    borderColor: c.brand,
  },
  on: {
    backgroundColor: c.brand,
  },
  off: {
    backgroundColor: c.surface,
  },
});
