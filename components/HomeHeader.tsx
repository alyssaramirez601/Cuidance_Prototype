import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Appear } from '@/components/Appear';
import { Icon } from '@/components/Icon';
import { layout, letterSpacing, radius, sizes, space, type } from '@/constants/tokens';
import { usePressBounce } from '@/hooks/useMotion';
import { makeStyles, useColors } from '@/hooks/useTheme';

type HomeHeaderProps = {
  greeting: string;
  name: string;
  onProfilePress: () => void;
};

// Direction A "Sunlit Collage" from the Nov 20 redesign canvas: a terracotta block with the brand's
// flat arches and sun, drawn as shapes so the greeting stays real text and the colors follow dark mode
export function HomeHeader({ greeting, name, onProfilePress }: HomeHeaderProps) {
  const styles = useStyles();
  const c = useColors();
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.9);
  return (
    <Appear style={styles.header}>
      <View style={styles.sun} />
      <View style={styles.archBack} />
      <View style={styles.archFront} />

      <View style={styles.top}>
        <Text style={styles.greetingSmall}>{greeting}</Text>
        <Animated.View style={bounceStyle}>
          <Pressable
            onPress={onProfilePress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            accessibilityRole="button"
            accessibilityLabel="Profile"
            style={styles.profile}
          >
            <Icon name="profile" size={sizes.icon.large} color={c.ink} />
          </Pressable>
        </Animated.View>
      </View>

      <Text style={styles.greetingName} accessibilityRole="header" numberOfLines={2}>
        {name ? `Hi, ${name}` : 'Hi there'}
      </Text>
    </Appear>
  );
}

const useStyles = makeStyles((c, g) =>
  StyleSheet.create({
    header: {
      marginHorizontal: -layout.screenEdge,
      marginTop: -space[24],
      paddingHorizontal: layout.screenEdge,
      paddingTop: space[24],
      paddingBottom: space[48] + space[32],
      gap: space[16],
      backgroundColor: g.terracottaBold,
      borderBottomRightRadius: radius.pill,
      overflow: 'hidden',
    },
    // Decorative shapes sit behind the text and never under it
    sun: {
      position: 'absolute',
      right: -space[48],
      top: -space[48],
      width: space[48] * 4,
      height: space[48] * 4,
      borderRadius: radius.pill,
      backgroundColor: g.orange,
    },
    archBack: {
      position: 'absolute',
      right: space[48],
      bottom: -space[48],
      width: space[48] * 3,
      height: space[48] * 4,
      borderTopLeftRadius: radius.pill,
      borderTopRightRadius: radius.pill,
      backgroundColor: g.greenBold,
    },
    archFront: {
      position: 'absolute',
      right: space[48] + space[24],
      bottom: -space[48],
      width: space[48] * 2,
      height: space[48] * 3,
      borderTopLeftRadius: radius.pill,
      borderTopRightRadius: radius.pill,
      backgroundColor: g.clay,
    },
    top: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    greetingSmall: {
      ...type.label,
      color: c.onBrand,
      textTransform: 'uppercase',
      letterSpacing: letterSpacing.eyebrow,
    },
    greetingName: {
      ...type.display,
      color: c.onBrand,
      // Stays clear of the arches on the right
      maxWidth: '65%',
    },
    profile: {
      width: space[48],
      height: space[48],
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface,
    },
  }),
);
