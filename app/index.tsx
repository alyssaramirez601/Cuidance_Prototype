import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, layout, letterSpacing, radius, space, type } from '@/constants/tokens';

// Artwork is cut straight from the Week 8 hi-fi Welcome screen (Figma "01 · Welcome + Intro (updated Oct 15)"),
// so the collage matches the approved design instead of being redrawn
const hero = require('@/assets/images/welcome-hero.png');
const footerArt = require('@/assets/images/welcome-footer.png');
const logo = require('@/assets/logo/logo-horizontal-green.png');

// Width / height of each image file, so they scale without stretching
const HERO_RATIO = 853 / 577;
const FOOTER_RATIO = 853 / 99;
const LOGO_RATIO = 1028 / 222;
// Logo version 4 full lockup minimum width, from CLAUDE.md
const LOGO_WIDTH = 160;

// The three feature tiles still use the design's own artwork. The sparkle, flask and list icons
// are not in docs/design-system/icons.md yet, so they can't be drawn with the Icon component
const helps = [
  {
    tile: require('@/assets/images/welcome-tile-sparkle.png'),
    title: 'Personalized guidance',
    body: 'Guidance based on what you choose to share.',
  },
  {
    tile: require('@/assets/images/welcome-tile-flask.png'),
    title: 'Product and ingredient notes',
    body: 'Understand what is in a product before you buy.',
  },
  {
    tile: require('@/assets/images/welcome-tile-list.png'),
    title: 'Try the quiz first',
    body: 'Preview a few questions before making an account.',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.heroWrap}>
        <Image source={hero} style={styles.hero} contentFit="cover" accessible={false} />
        <Image source={logo} style={styles.logo} contentFit="contain" accessibilityLabel="Cuidance" />
      </View>

      <View style={[styles.intro, styles.textInset]}>
        <Text style={styles.title} accessibilityRole="header">
          Beauty guidance that fits you.
        </Text>
        <Text style={styles.body}>From hair to skin to the ingredients in between, guidance shaped around you.</Text>
        <Text style={styles.body}>
          Tell us what you want to explore, and Cuidance will help explain what may fit and why.
        </Text>
      </View>

      <View style={styles.textInset}>
        <Text style={styles.eyebrow}>What Cuidance helps with</Text>
        {helps.map((item, index) => (
          <View key={item.title} style={[styles.helpRow, index > 0 && styles.helpRowDivider]}>
            <Image source={item.tile} style={styles.tile} contentFit="contain" accessible={false} />
            <View style={styles.helpText}>
              <Text style={styles.helpTitle}>{item.title}</Text>
              <Text style={styles.helpBody}>{item.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.actions, styles.buttonInset]}>
        <Button label="Create account" onPress={() => router.push('/create-account')} />
        <Pressable
          onPress={() => router.push('/sign-in')}
          accessibilityRole="link"
          accessibilityLabel="Already have an account? Sign in"
          style={styles.link}
        >
          <Text style={styles.linkLabel}>Already have an account? Sign in</Text>
        </Pressable>
      </View>

      <Image source={footerArt} style={styles.footerArt} contentFit="cover" accessible={false} />
    </Screen>
  );
}

const c = colors.light;

const styles = StyleSheet.create({
  // The artwork runs edge to edge, so it steps out of the screen padding
  heroWrap: {
    marginHorizontal: -layout.screenEdge,
    marginTop: -space[24],
    marginBottom: space[8],
  },
  // Shown in full, never cropped. Welcome scrolls, so it doesn't have to squeeze into one view
  hero: {
    width: '100%',
    aspectRatio: HERO_RATIO,
  },
  // Sits on the paper curve at the bottom of the artwork, where the design places it
  logo: {
    position: 'absolute',
    left: layout.screenEdge + space[16],
    bottom: space[4],
    width: LOGO_WIDTH,
    height: LOGO_WIDTH / LOGO_RATIO,
  },
  // The design sets text further in than the screen edge, and the button a little less far
  textInset: {
    paddingHorizontal: space[16],
  },
  buttonInset: {
    paddingHorizontal: space[8],
  },
  intro: {
    gap: space[12],
  },
  title: {
    ...type.display,
    color: c.ink,
  },
  body: {
    ...type.body,
    color: c.inkMuted,
  },
  eyebrow: {
    ...type.caption,
    fontFamily: type.label.fontFamily,
    color: c.highlight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
    marginBottom: space[8],
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
    paddingVertical: space[12],
  },
  helpRowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: c.border,
  },
  tile: {
    width: space[48],
    height: space[48],
    borderRadius: radius.small,
  },
  helpText: {
    flex: 1,
  },
  helpTitle: {
    ...type.label,
    color: c.ink,
  },
  helpBody: {
    ...type.caption,
    color: c.inkMuted,
  },
  actions: {
    gap: space[4],
  },
  link: {
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: {
    ...type.label,
    color: c.accent,
  },
  footerArt: {
    marginHorizontal: -layout.screenEdge,
    marginBottom: -space[24],
    aspectRatio: FOOTER_RATIO,
  },
});
