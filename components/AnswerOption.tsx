import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, radius, sizes, space, stroke, type } from '@/constants/tokens';

export type AnswerOptionIndicator = 'radio' | 'checkbox';
export type AnswerOptionState = 'default' | 'pressed' | 'selected' | 'disabled';

type AnswerOptionProps = {
  label: string;
  onPress: () => void;
  // radio for "Choose one", checkbox for "Choose up to N" and "Select all that apply"
  indicator: AnswerOptionIndicator;
  // The chosen and disabled states are controlled by the screen. Pressed follows the real press
  state?: AnswerOptionState;
};

const c = colors.light;

const looks = {
  default: { fill: c.surface, border: c.borderStrong, borderWidth: stroke.default, box: c.surface, boxBorder: c.borderStrong, label: c.ink },
  pressed: { fill: c.background, border: c.borderStrong, borderWidth: stroke.default, box: c.surface, boxBorder: c.borderStrong, label: c.ink },
  selected: { fill: c.selectedSurface, border: c.selected, borderWidth: stroke.strong, box: c.selected, boxBorder: c.selected, label: c.ink },
  disabled: { fill: c.disabledSurface, border: c.border, borderWidth: stroke.default, box: c.disabledSurface, boxBorder: c.disabledInk, label: c.disabledInk },
} as const;

// The mark inside the indicator and the thicker outline show the choice, so color is never the only signal
export function AnswerOption({ label, onPress, indicator, state = 'default' }: AnswerOptionProps) {
  const isRadio = indicator === 'radio';
  const isDisabled = state === 'disabled';
  const isSelected = state === 'selected';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole={isRadio ? 'radio' : 'checkbox'}
      accessibilityLabel={label}
      accessibilityState={isRadio ? { selected: isSelected, disabled: isDisabled } : { checked: isSelected, disabled: isDisabled }}
    >
      {({ pressed }) => {
        const look = looks[state === 'default' && pressed ? 'pressed' : state];
        return (
          <View style={[styles.row, { backgroundColor: look.fill, borderColor: look.border, borderWidth: look.borderWidth }]}>
            <View
              style={[
                styles.indicator,
                { borderRadius: isRadio ? radius.pill : radius.small, backgroundColor: look.box, borderColor: look.boxBorder },
              ]}
            >
              {isSelected && isRadio ? <View style={styles.dot} /> : null}
              {isSelected && !isRadio ? <Icon name="check" size={sizes.icon.small} color={c.surface} /> : null}
            </View>
            <Text style={[styles.label, { color: look.label }]}>{label}</Text>
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: sizes.answerOptionMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    padding: space[16],
    borderRadius: radius.medium,
  },
  indicator: {
    width: sizes.answerIndicator,
    height: sizes.answerIndicator,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: stroke.default,
  },
  dot: {
    width: sizes.answerRadioDot,
    height: sizes.answerRadioDot,
    borderRadius: radius.pill,
    backgroundColor: c.surface,
  },
  label: {
    ...type.body,
    flex: 1,
  },
});
