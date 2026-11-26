import { Image } from 'expo-image';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { layout, radius, space, stroke, type } from '@/constants/tokens';
import { usePressBounce } from '@/hooks/useMotion';
import { makeStyles } from '@/hooks/useTheme';
import { isFocused } from '@/lib/focus';

type CareAreaTileProps = {
  // Live text from data/categories.ts, never part of the picture
  label: string;
  art: number;
  onPress: () => void;
};

// A compact illustrated category card (Home v2, Nov 25): art on top, the real category name under it.
// The label may wrap to more lines rather than be cut. Fills whatever width its grid gives it
export function CareAreaTile({ label, art, onPress }: CareAreaTileProps) {
  const styles = useStyles();
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.95);
  return (
    <Animated.View style={[styles.wrap, bounceStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={(state) => [styles.tile, isFocused(state) && styles.focused]}
      >
        <View style={styles.art}>
          <Image source={art} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const useStyles = makeStyles((c, g) => StyleSheet.create({
  wrap: {
    flex: 1,
  },
  tile: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    gap: space[8],
    padding: space[4],
    paddingBottom: space[12],
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
    boxShadow: g.shadowLift,
  },
  focused: {
    outlineColor: c.accent,
    outlineStyle: 'solid',
    outlineWidth: stroke.strong,
  },
  art: {
    width: '100%',
    aspectRatio: 1,
  },
  label: {
    ...type.caption,
    fontFamily: type.label.fontFamily,
    color: c.ink,
    textAlign: 'center',
  },
}));
