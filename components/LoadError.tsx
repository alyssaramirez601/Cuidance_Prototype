import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { colors, radius, space, type } from '@/constants/tokens';

type LoadErrorProps = {
  message: string;
  onRetry: () => void;
};

// The friendly "couldn't load" box with a retry, as CLAUDE.md asks for every screen
export function LoadError({ message, onRetry }: LoadErrorProps) {
  return (
    <View style={styles.box} accessibilityLiveRegion="polite">
      <Text style={styles.text}>{message}</Text>
      <Button label="Try again" style="secondary" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: space[12],
    padding: space[16],
    borderRadius: radius.medium,
    backgroundColor: colors.light.errorSurface,
  },
  text: {
    ...type.body,
    color: colors.light.error,
  },
});
