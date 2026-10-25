import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, space, type } from '@/constants/tokens';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen centered>
      <View style={styles.intro}>
        <Text style={styles.title} accessibilityRole="header">
          Cuidance
        </Text>
        <Text style={styles.tagline}>Beauty guidance that fits you.</Text>
      </View>
      <View style={styles.actions}>
        <Button label="Create account" onPress={() => router.push('/create-account')} />
        <Button label="Sign in" variant="secondary" onPress={() => router.push('/sign-in')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: space[8],
    marginBottom: space[16],
  },
  title: {
    ...type.display,
    color: colors.light.ink,
  },
  tagline: {
    ...type.body,
    color: colors.light.ink,
  },
  actions: {
    gap: space[12],
  },
});
