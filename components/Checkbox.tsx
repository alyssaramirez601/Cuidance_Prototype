import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, radius, sizes, space, stroke, type } from '@/constants/tokens';

export type CheckboxState = 'unchecked' | 'checked' | 'error' | 'disabled';

type CheckboxProps = {
  label: string;
  onPress: () => void;
  state?: CheckboxState;
  // Shown under the label in the error state
  error?: string;
};

const c = colors.light;

const boxLooks = {
  unchecked: { fill: c.surface, border: c.borderStrong, borderWidth: stroke.default },
  checked: { fill: c.accent, border: c.accent, borderWidth: stroke.default },
  error: { fill: c.surface, border: c.error, borderWidth: stroke.strong },
  disabled: { fill: c.disabledSurface, border: c.disabledInk, borderWidth: stroke.default },
} as const;

export function Checkbox({ label, onPress, state = 'unchecked', error }: CheckboxProps) {
  const look = boxLooks[state];
  const isDisabled = state === 'disabled';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: state === 'checked', disabled: isDisabled }}
      style={styles.row}
    >
      <View style={[styles.box, { backgroundColor: look.fill, borderColor: look.border, borderWidth: look.borderWidth }]}>
        {state === 'checked' ? <Icon name="check" size={sizes.icon.small} color={c.onAccent} /> : null}
      </View>
      <View style={styles.textColumn}>
        <Text style={[styles.label, { color: isDisabled ? c.disabledInk : c.ink }]}>{label}</Text>
        {state === 'error' && error ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {error}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space[12],
  },
  box: {
    width: sizes.checkboxBox,
    height: sizes.checkboxBox,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.small,
  },
  textColumn: {
    flex: 1,
    gap: space[4],
  },
  label: {
    ...type.body,
  },
  error: {
    ...type.caption,
    color: c.error,
  },
});
