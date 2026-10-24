import { StyleSheet, Text, View } from 'react-native';

import { colors, layout, space, type } from '@/constants/tokens';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title} accessibilityRole="header">
        Cuidance
      </Text>
      <Text style={styles.tagline}>Beauty guidance that fits you.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.screenEdge,
    backgroundColor: colors.light.background,
  },
  title: {
    ...type.display,
    color: colors.light.ink,
    marginBottom: space[8],
  },
  tagline: {
    ...type.body,
    color: colors.light.ink,
  },
});
