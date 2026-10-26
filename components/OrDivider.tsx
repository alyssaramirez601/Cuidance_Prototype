import { StyleSheet, Text, View } from 'react-native';

import { colors, space, stroke, type } from '@/constants/tokens';

// Sits between the main button and another way to sign in
export function OrDivider() {
  return (
    <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.line} />
      <Text style={styles.label}>or</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  line: {
    flex: 1,
    height: stroke.default,
    backgroundColor: colors.light.border,
  },
  label: {
    ...type.label,
    color: colors.light.inkMuted,
  },
});
