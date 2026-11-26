import { Image } from 'expo-image';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Appear } from '@/components/Appear';
import { Icon, type IconName } from '@/components/Icon';
import { letterSpacing, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { usePressBounce } from '@/hooks/useMotion';
import { makeStyles, useColors, useTheme } from '@/hooks/useTheme';
import { isFocused } from '@/lib/focus';

type HomeHeaderProps = {
  greeting: string;
  name: string;
  onProfilePress: () => void;
  // Opens notification settings, as Explore's bell does. There is no inbox or unread count
  onNotificationsPress: () => void;
  notificationsLabel: string;
};

const logo = {
  light: require('@/assets/logo/logo-horizontal-green.png'),
  dark: require('@/assets/logo/logo-horizontal-light.png'),
};
// The logo file is 1028 x 222; 160 wide is the brand's minimum for the full lockup
const LOGO_WIDTH = 160;
const LOGO_RATIO = 1028 / 222;
// Above this text size the collage accent steps aside so the greeting keeps its width
const HIDE_ART_AT_FONT_SCALE = 1.3;

// Home v2 "Editorial Care" header (Nov 25): the real logo, the time-of-day greeting and the person's
// name in Newsreader on the page color, and a small cut-paper accent to the side, never behind text
export function HomeHeader({ greeting, name, onProfilePress, onNotificationsPress, notificationsLabel }: HomeHeaderProps) {
  const styles = useStyles();
  const { scheme } = useTheme();
  const { fontScale } = useWindowDimensions();
  return (
    <Appear style={styles.header}>
      <View style={styles.top}>
        <Image source={logo[scheme]} style={styles.logo} contentFit="contain" accessibilityLabel="Cuidance" />
        <View style={styles.actions}>
          <RoundButton icon="bell" label={notificationsLabel} onPress={onNotificationsPress} />
          <RoundButton icon="profile" label="Profile" onPress={onProfilePress} />
        </View>
      </View>

      <View style={styles.greetingRow}>
        <View style={styles.greetingText}>
          <Text style={styles.greetingSmall}>{greeting}</Text>
          {/* Wraps as far as it needs, so long names are never cut */}
          <Text style={styles.greetingName} accessibilityRole="header">
            {name ? `Hi, ${name}` : 'Hi there'}
          </Text>
        </View>
        {fontScale < HIDE_ART_AT_FONT_SCALE ? <HeaderAccent /> : null}
      </View>
    </Appear>
  );
}

function RoundButton({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const styles = useStyles();
  const c = useColors();
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.9);
  return (
    <Animated.View style={bounceStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={(state) => [styles.round, isFocused(state) && styles.focused]}
      >
        <Icon name={icon} size={sizes.icon.large} color={c.ink} />
      </Pressable>
    </Animated.View>
  );
}

// TEMPORARY until assets/home/header-accent-{light,dark}.png is approved: the same cut-paper shapes
// drawn in code (sun, arch, a blue leaf), so they follow light and dark mode
function HeaderAccent() {
  const styles = useStyles();
  return (
    <View style={styles.accent} accessible={false}>
      <View style={styles.sun} />
      <View style={styles.arch} />
      <View style={styles.leaf} />
    </View>
  );
}

const useStyles = makeStyles((c, g) =>
  StyleSheet.create({
    header: {
      gap: space[16],
    },
    top: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: space[12],
    },
    logo: {
      width: LOGO_WIDTH,
      aspectRatio: LOGO_RATIO,
    },
    actions: {
      flexDirection: 'row',
      gap: space[8],
    },
    round: {
      width: space[48],
      height: space[48],
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.pill,
      borderWidth: stroke.default,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    focused: {
      outlineColor: c.accent,
      outlineStyle: 'solid',
      outlineWidth: stroke.strong,
    },
    greetingRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: space[12],
    },
    greetingText: {
      flex: 1,
      gap: space[4],
    },
    // Care Terracotta on the page: 5.4:1 light, 9.2:1 dark (the old eyebrow on the terracotta block was 4.34:1)
    greetingSmall: {
      ...type.label,
      color: c.highlight,
      textTransform: 'uppercase',
      letterSpacing: letterSpacing.eyebrow,
    },
    greetingName: {
      ...type.display,
      color: c.ink,
    },
    accent: {
      width: space[48] * 2,
      height: space[48] * 2,
    },
    sun: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: space[48] + space[24],
      height: space[48] + space[24],
      borderRadius: radius.pill,
      backgroundColor: g.orange,
    },
    arch: {
      position: 'absolute',
      left: space[8],
      bottom: 0,
      width: space[48],
      height: space[48] + space[16],
      borderTopLeftRadius: radius.pill,
      borderTopRightRadius: radius.pill,
      backgroundColor: g.terracottaBold,
    },
    leaf: {
      position: 'absolute',
      right: space[8],
      bottom: 0,
      width: space[32],
      height: space[48],
      borderTopLeftRadius: radius.pill,
      borderBottomRightRadius: radius.pill,
      backgroundColor: g.blueBold,
    },
  }),
);
