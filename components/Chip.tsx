import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { Icon } from '@/components/Icon';
import { radius, sizes, space, stroke, type } from '@/constants/tokens';
import { type Palette, makeStyles, useColors } from '@/hooks/useTheme';
import { usePop, usePressBounce } from '@/hooks/useMotion';

export type ChipState = 'default' | 'pressed' | 'selected' | 'disabled';

type ChipProps = {
  label: string;
  onPress: () => void;
  state?: ChipState;
};

const looks = (c: Palette) => ({
  default: { fill: c.surface, border: c.borderStrong, borderWidth: stroke.default, text: c.ink },
  pressed: { fill: c.background, border: c.borderStrong, borderWidth: stroke.default, text: c.ink },
  selected: { fill: c.selectedSurface, border: c.selected, borderWidth: stroke.strong, text: c.selected },
  disabled: { fill: c.disabledSurface, border: c.border, borderWidth: stroke.default, text: c.disabledInk },
} as const);

export function Chip({ label, onPress, state = 'default' }: ChipProps) {
  const c = useColors();
  const styles = useStyles();
  const isDisabled = state === 'disabled';
  const isSelected = state === 'selected';
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.93);
  const popStyle = usePop(isSelected);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      style={styles.alignStart}
    >
      {({ pressed }) => {
        const look = looks(c)[state === 'default' && pressed ? 'pressed' : state];
        return (
          <Animated.View style={[styles.chip, { backgroundColor: look.fill, borderColor: look.border, borderWidth: look.borderWidth }, isSelected ? popStyle : bounceStyle]}>
            {isSelected ? <Icon name="check" size={sizes.icon.small} color={look.text} /> : null}
            <Text style={[styles.label, { color: look.text }]}>{label}</Text>
          </Animated.View>
        );
      }}
    </Pressable>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  alignStart: {
    alignSelf: 'flex-start',
  },
  chip: {
    minHeight: sizes.chipHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
    paddingVertical: space[8],
    paddingHorizontal: space[16],
    borderRadius: radius.pill,
  },
  label: {
    ...type.label,
  },
}));
