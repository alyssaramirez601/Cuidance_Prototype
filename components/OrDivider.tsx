import { StyleSheet, Text, View } from 'react-native';

import { space, stroke, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

// Sits between the main button and another way to sign in
export function OrDivider() {
  const styles = useStyles();
  return (
    <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.line} />
      <Text style={styles.label}>or</Text>
      <View style={styles.line} />
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  line: {
    flex: 1,
    height: stroke.default,
    backgroundColor: c.border,
  },
  label: {
    ...type.label,
    color: c.inkMuted,
  },
}));
