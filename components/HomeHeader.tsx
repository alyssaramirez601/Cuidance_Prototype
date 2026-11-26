import { Image } from 'expo-image';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Appear } from '@/components/Appear';
import { Icon, type IconName } from '@/components/Icon';
import { letterSpacing, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { usePressBounce } from '@/hooks/useMotion';
import { makeStyles, useColors, useTheme } from '@/hooks/useTheme';
import { homeArtRatio } from '@/data/homeArt';
import { isFocused } from '@/lib/focus';

type HomeHeaderProps = {
  greeting: string;
  name: string;
  onProfilePress: () => void;
  // Opens notification settings, as Explore's bell does. There is no inbox or unread count
  onNotificationsPress: () => void;
  notificationsLabel: string;
  // The header artwork for the current mode (data/homeArt.ts). Leave out and the slot stays empty
  accentArt?: number;
};

const logo = {
  light: require('@/assets/logo/logo-horizontal-green.png'),
  dark: require('@/assets/logo/logo-horizontal-light.png'),
};
// The logo file is 1028 x 222; 160 wide is the brand's minimum for the full lockup
const LOGO_WIDTH = 160;
const LOGO_RATIO = 1028 / 222;
// A first name with a word longer than this uses the smaller heading size, so it wraps between words
// instead of breaking inside one (fits a 21-letter word at 360 px)
const LONG_WORD = 11;

// Home v2 "Editorial Care" header (Nov 25): the real logo, the time-of-day greeting and the person's
// name in Newsreader on the page color. The bell and profile buttons always sit on a clear page.
// The artwork slot sits beside the greeting, away from the buttons, cropped by the screen's right
// edge. It is empty until the final transparent artwork is supplied (no temporary shapes, Alyssa Nov 25)
export function HomeHeader({ greeting, name, onProfilePress, onNotificationsPress, notificationsLabel, accentArt }: HomeHeaderProps) {
  const styles = useStyles();
  const { scheme } = useTheme();
  const longWord = name.split(/\s+/).some((word) => word.length > LONG_WORD);
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
          <Text style={[styles.greetingName, longWord && styles.greetingLong]} accessibilityRole="header">
            {name ? `Hi, ${name}` : 'Hi there'}
          </Text>
        </View>
        {/* A long name keeps the full width, so the art steps aside rather than squeeze the words */}
        {accentArt && !longWord ? (
          <View style={styles.accent} accessible={false}>
            <Image source={accentArt} style={styles.accentArt} contentFit="cover" accessible={false} />
          </View>
        ) : null}
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
    greetingLong: {
      ...type.heading,
    },
    greetingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space[12],
    },
    // The 288 x 288 artwork shown 120 px square; 96 px of it shows, and the screen's right edge
    // crops the rest
    accent: {
      width: space[48] * 2,
      height: space[48] * 2 + space[24],
      marginRight: -space[24],
      overflow: 'hidden',
    },
    accentArt: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      aspectRatio: homeArtRatio.header,
    },
  }),
);
