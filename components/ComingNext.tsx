import { StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '@/constants/tokens';

type ComingNextProps = {
  title: string;
  body: string;
};

// Temporary stand-in for a tab that's being built next, so the tab bar has no dead ends
export function ComingNext({ title, body }: ComingNextProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space[8],
  },
  title: {
    ...type.heading,
    color: colors.light.ink,
  },
  body: {
    ...type.body,
    color: colors.light.inkMuted,
  },
});
