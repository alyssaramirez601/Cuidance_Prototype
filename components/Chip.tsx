import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, radius, sizes, space, stroke, type } from '@/constants/tokens';

export type ChipState = 'default' | 'pressed' | 'selected' | 'disabled';

type ChipProps = {
  label: string;
  onPress: () => void;
  state?: ChipState;
};

const c = colors.light;

const looks = {
  default: { fill: c.surface, border: c.borderStrong, borderWidth: stroke.default, text: c.ink },
  pressed: { fill: c.background, border: c.borderStrong, borderWidth: stroke.default, text: c.ink },
  selected: { fill: c.selectedSurface, border: c.selected, borderWidth: stroke.strong, text: c.selected },
  disabled: { fill: c.disabledSurface, border: c.border, borderWidth: stroke.default, text: c.disabledInk },
} as const;

export function Chip({ label, onPress, state = 'default' }: ChipProps) {
  const isDisabled = state === 'disabled';
  const isSelected = state === 'selected';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      style={styles.alignStart}
    >
      {({ pressed }) => {
        const look = looks[state === 'default' && pressed ? 'pressed' : state];
        return (
          <View style={[styles.chip, { backgroundColor: look.fill, borderColor: look.border, borderWidth: look.borderWidth }]}>
            {isSelected ? <Icon name="check" size={sizes.icon.small} color={look.text} /> : null}
            <Text style={[styles.label, { color: look.text }]}>{label}</Text>
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
