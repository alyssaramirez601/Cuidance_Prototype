import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, graphic, layout, radius, sizes, space, type } from '@/constants/tokens';

type HomeHeaderProps = {
  greeting: string;
  name: string;
  onProfilePress: () => void;
};

// The terracotta band is drawn in code so the greeting always sits on plain color and stays
// readable. The collage on the right is artwork kit 08 (ChatGPT, transparent background),
// made in the Welcome collage style. Band and swoosh sizes come from the Week 8 Step 5 frame
const art = require('@/assets/images/home-header-art.png');
const swoosh = require('@/assets/images/home-header-swoosh.png');
const HEADER_HEIGHT = 220;
const ART_RATIO = 1196 / 1315;

const c = colors.light;
const g = graphic.light;

export function HomeHeader({ greeting, name, onProfilePress }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={[styles.shape, styles.band]} />
      <Image source={art} style={styles.art} contentFit="contain" accessible={false} />
      <Image source={swoosh} style={styles.swoosh} tintColor={c.background} contentFit="contain" accessible={false} />

      <View style={styles.greeting}>
        <Text style={styles.greetingSmall}>{greeting}</Text>
        <Text style={styles.greetingName} accessibilityRole="header">
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
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    marginHorizontal: -layout.screenEdge,
  },
  shape: {
    position: 'absolute',
  },
  band: {
    width: 367,
    height: 158,
    left: -42,
    top: 38,
    borderTopRightRadius: radius.pill,
    borderBottomRightRadius: radius.pill,
    backgroundColor: g.terracottaDeep,
  },
  art: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: HEADER_HEIGHT,
    width: HEADER_HEIGHT * ART_RATIO,
  },
  swoosh: {
    position: 'absolute',
    width: 97,
    height: 21,
    left: layout.screenEdge,
    top: 141,
  },
  greeting: {
    position: 'absolute',
    left: layout.screenEdge,
    top: 65,
    right: 120,
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
    width: space[48] + space[8],
    height: space[48] + space[8],
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.surface,
  },
});
