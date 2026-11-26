import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { ArtFrame } from '@/components/ArtFrame';
import { Icon } from '@/components/Icon';
import { layout, letterSpacing, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { usePressBounce } from '@/hooks/useMotion';
import { makeStyles, useColors } from '@/hooks/useTheme';
import { isFocused } from '@/lib/focus';

type GuideRowProps = {
  title: string;
  // Small caps line, like "Explainer · 2 min read"
  eyebrow: string;
  art: number;
  onPress: () => void;
  // Draws the line under the row, except on the last one
  divider?: boolean;
};

// An educational guide as a publication row (Home v2, Nov 25): arch-topped cover, caps eyebrow and a
// Newsreader title that wraps as far as it needs. Rows, not cards, so guides read apart from products
export function GuideRow({ title, eyebrow, art, onPress, divider = true }: GuideRowProps) {
  const styles = useStyles();
  const c = useColors();
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.98);
  return (
    <Animated.View style={bounceStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${eyebrow}`}
        style={(state) => [styles.row, divider && styles.divider, isFocused(state) && styles.focused]}
      >
        <ArtFrame source={art} shape="arch" style={styles.art} />
        <View style={styles.text}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.round}>
          <Icon name="arrow" size={sizes.icon.medium} color={c.accent} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  row: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
    paddingVertical: space[12],
  },
  divider: {
    borderBottomWidth: stroke.default,
    borderBottomColor: c.border,
  },
  focused: {
    outlineColor: c.accent,
    outlineStyle: 'solid',
    outlineWidth: stroke.strong,
  },
  art: {
    width: space[48] + space[24],
    aspectRatio: 1,
  },
  text: {
    flex: 1,
    gap: space[4],
  },
  eyebrow: {
    ...type.eyebrow,
    color: c.highlight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  title: {
    ...type.editorialTitle,
    color: c.ink,
  },
  round: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: stroke.default,
    borderColor: c.border,
  },
}));
