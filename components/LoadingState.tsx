import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, layout, space, type } from '@/constants/tokens';

type LoadingStateProps = {
  label: string;
};

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator color={colors.light.accent} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[12],
    paddingHorizontal: layout.screenEdge,
    backgroundColor: colors.light.background,
  },
  label: {
    ...type.body,
    color: colors.light.inkMuted,
  },
});
