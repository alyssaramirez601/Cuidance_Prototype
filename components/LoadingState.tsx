import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { layout, space, type } from '@/constants/tokens';
import { makeStyles, useColors } from '@/hooks/useTheme';

type LoadingStateProps = {
  label: string;
};

export function LoadingState({ label }: LoadingStateProps) {
  const styles = useStyles();
  const c = useColors();
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator color={c.accent} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[12],
    paddingHorizontal: layout.screenEdge,
    backgroundColor: c.background,
  },
  label: {
    ...type.body,
    color: c.inkMuted,
  },
}));
