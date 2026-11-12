import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, graphic, layout, radius, sizes, space, type } from '@/constants/tokens';

type HomeHeaderProps = {
  greeting: string;
  name: string;
  onProfilePress: () => void;
};

// Shapes from the Week 8 Step 5 "Home · quiz done" header, rebuilt in code so the greeting
// stays real text. Sizes are the Figma frame's, scaled to the screen width by the parent
const mark = require('@/assets/images/home-header-mark.png');
const swoosh = require('@/assets/images/home-header-swoosh.png');
const HEADER_HEIGHT = 220;

const c = colors.light;
const g = graphic.light;

export function HomeHeader({ greeting, name, onProfilePress }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={[styles.shape, styles.green]} />
      <View style={[styles.shape, styles.clay]} />
      <View style={[styles.shape, styles.band]} />
      <View style={[styles.shape, styles.olive]} />
      <Image source={mark} style={styles.mark} tintColor={c.ink} contentFit="contain" accessible={false} />
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
  green: {
    width: 284,
    height: 252,
    right: -52,
    top: -74,
    borderRadius: 134,
    backgroundColor: g.greenBold,
  },
  clay: {
    width: 178,
    height: 178,
    right: -31,
    bottom: -52,
    borderRadius: 89,
    backgroundColor: g.clay,
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
  olive: {
    width: 101,
    height: 101,
    left: 250,
    bottom: -48,
    borderRadius: 50,
    backgroundColor: g.oliveBold,
  },
  mark: {
    position: 'absolute',
    width: 105,
    height: 82,
    right: 27,
    bottom: 15,
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
