import type { ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { layout, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { makeStyles, useColors } from '@/hooks/useTheme';
import { usePressBounce } from '@/hooks/useMotion';

type ListRowProps = {
  label: string;
  onPress: () => void;
  // Something small before the label, like a step number
  leading?: ReactNode;
  // Something small after the label, like evidence dots
  trailing?: ReactNode;
  // A muted line under the label, like "Ready to revisit anytime"
  detail?: string;
};

// The one tappable row (CLAUDE.md names it). Not in the Figma design system yet, so Esme should add it there
export function ListRow({ label, onPress, leading, trailing, detail }: ListRowProps) {
  const styles = useStyles();
  const c = useColors();
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.97);
  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} accessibilityRole="button" accessibilityLabel={label} accessibilityHint="Opens more detail">
      {({ pressed }) => (
        <Animated.View style={[styles.row, pressed && styles.pressed, bounceStyle]}>
          {leading}
          <View style={styles.middle}>
            <View style={styles.text}>
              <Text style={styles.label}>{label}</Text>
              {detail ? <Text style={styles.detail}>{detail}</Text> : null}
            </View>
            {trailing}
          </View>
          <Icon name="arrow" size={sizes.icon.medium} color={c.accent} />
        </Animated.View>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  row: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  pressed: {
    backgroundColor: c.background,
  },
  middle: {
    flex: 1,
    gap: space[8],
  },
  text: {
    gap: space[4],
  },
  label: {
    ...type.body,
    color: c.ink,
  },
  detail: {
    ...type.caption,
    color: c.inkMuted,
  },
}));
