import { Image, type ImageSource } from 'expo-image';
import { useRouter, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/TopBar';
import { space, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

type PageHeaderProps = {
  title: string;
  intro?: string;
  // Leave out on pages without a picture
  art?: ImageSource | number;
  // Where Back goes when there's no history, like after opening a link straight to the page
  backTo?: Href;
};

// Top of each inner page (Profile and Explore): a Back bar, an illustration if there is one, then the title and intro.
// The art is decoration, so screen readers skip it and read the title instead
export function PageHeader({ title, intro, art, backTo = '/profile' }: PageHeaderProps) {
  const styles = useStyles();
  const router = useRouter();
  return (
    <View style={styles.header}>
      <View style={styles.topBar}>
        {/* Opened from a link or a refresh there's nothing to go back to, so it returns to backTo */}
        <TopBar onBack={() => (router.canGoBack() ? router.back() : router.replace(backTo))} />
      </View>
      {art ? <Image source={art} style={styles.art} contentFit="contain" accessible={false} /> : null}
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {intro ? <Text style={styles.intro}>{intro}</Text> : null}
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
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
    color: c.ink,
  },
  intro: {
    ...type.body,
    color: c.inkMuted,
  },
}));
