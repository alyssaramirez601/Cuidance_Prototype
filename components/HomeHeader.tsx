import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, layout, radius, sizes, space, type } from '@/constants/tokens';

type HomeHeaderProps = {
  greeting: string;
  name: string;
  onProfilePress: () => void;
};

// Artwork kit 08 (ChatGPT, made in the Welcome collage style). The terracotta band is left
// plain so the greeting sits on it as real text, with the person's own name
const art = require('@/assets/images/home-header-art.png');
const ART_RATIO = 1672 / 941;

const c = colors.light;

export function HomeHeader({ greeting, name, onProfilePress }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <Image source={art} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />

      {/* Sits in the middle of the terracotta band, which runs from about 14% to 82% of the height */}
      <View style={styles.greeting}>
        <Text style={styles.greetingSmall}>{greeting}</Text>
        <Text style={styles.greetingName} accessibilityRole="header" numberOfLines={2}>
          {name ? `Hi, ${name}` : 'Hi there'}
        </Text>
      </View>

      <Pressable onPress={onProfilePress} accessibilityRole="button" accessibilityLabel="Profile" style={styles.profile}>
        <Icon name="profile" size={sizes.icon.large} color={c.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    aspectRatio: ART_RATIO,
    marginHorizontal: -layout.screenEdge,
  },
  greeting: {
    position: 'absolute',
    left: layout.screenEdge,
    top: '30%',
    // Stays inside the band, clear of the vessel and leaves on the right
    width: '62%',
  },
  greetingSmall: {
    ...type.label,
    fontFamily: type.body.fontFamily,
    color: c.onBrand,
  },
  greetingName: {
    ...type.heading,
    color: c.onBrand,
  },
  profile: {
    position: 'absolute',
    right: space[24],
    top: space[16],
    width: space[48],
    height: space[48],
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.surface,
  },
});
