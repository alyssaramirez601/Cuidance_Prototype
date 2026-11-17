import { Image, type ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/TopBar';
import { colors, space, type } from '@/constants/tokens';

type ProfilePageHeaderProps = {
  title: string;
  intro?: string;
  art: ImageSource;
};

// Top of each Profile page: a Back bar, one of Esme's Week 12 illustrations, then the title and intro.
// The art is decoration, so screen readers skip it and read the title instead
export function ProfilePageHeader({ title, intro, art }: ProfilePageHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <View style={styles.topBar}>
        {/* Opened from a link or a refresh there's nothing to go back to, so it returns to Profile */}
        <TopBar onBack={() => (router.canGoBack() ? router.back() : router.replace('/profile'))} />
      </View>
      <Image source={art} style={styles.art} contentFit="contain" accessible={false} />
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {intro ? <Text style={styles.intro}>{intro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: space[8],
  },
  topBar: {
    marginHorizontal: -space[16],
    marginTop: -space[24],
  },
  art: {
    width: space[48] * 2,
    height: space[48] * 2,
    marginBottom: space[8],
  },
  title: {
    ...type.heading,
    color: colors.light.ink,
  },
  intro: {
    ...type.body,
    color: colors.light.inkMuted,
  },
});
