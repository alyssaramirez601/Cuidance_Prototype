import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, layout, radius, sizes, space, stroke, type } from '@/constants/tokens';

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

const c = colors.light;

// The one tappable row (CLAUDE.md names it). Not in the Figma design system yet, so Esme should add it there
export function ListRow({ label, onPress, leading, trailing, detail }: ListRowProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} accessibilityHint="Opens more detail">
      {({ pressed }) => (
        <View style={[styles.row, pressed && styles.pressed]}>
          {leading}
          <View style={styles.middle}>
            <View style={styles.text}>
              <Text style={styles.label}>{label}</Text>
              {detail ? <Text style={styles.detail}>{detail}</Text> : null}
            </View>
            {trailing}
          </View>
          <Icon name="arrow" size={sizes.icon.medium} color={c.accent} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
