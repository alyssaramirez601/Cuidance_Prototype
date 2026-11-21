import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { fontFamily, layout, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { type Palette, makeStyles, useColors } from '@/hooks/useTheme';
import { useNativeDriver, usePop, usePressBounce, useReducedMotion } from '@/hooks/useMotion';

export type AnswerOptionIndicator = 'radio' | 'checkbox';
export type AnswerOptionState = 'default' | 'pressed' | 'selected' | 'disabled';

type AnswerOptionProps = {
  label: string;
  onPress: () => void;
  // radio for "Choose one", checkbox for "Choose up to N" and "Select all that apply"
  indicator: AnswerOptionIndicator;
  // The chosen and disabled states are controlled by the screen. Pressed follows the real press
  state?: AnswerOptionState;
  // card: the boxed Figma option. row: the Nov 20 redesign's editorial list, with a small letter in front
  look?: 'card' | 'row';
  // The letter in front of a row option, like "a"
  letter?: string;
};

const looks = (c: Palette) => ({
  default: { fill: c.surface, border: c.borderStrong, borderWidth: stroke.default, box: c.surface, boxBorder: c.borderStrong, label: c.ink },
  pressed: { fill: c.background, border: c.borderStrong, borderWidth: stroke.default, box: c.surface, boxBorder: c.borderStrong, label: c.ink },
  selected: { fill: c.selectedSurface, border: c.selected, borderWidth: stroke.strong, box: c.selected, boxBorder: c.selected, label: c.ink },
  disabled: { fill: c.disabledSurface, border: c.border, borderWidth: stroke.default, box: c.disabledSurface, boxBorder: c.disabledInk, label: c.disabledInk },
} as const);

// The mark inside the indicator and the thicker outline show the choice, so color is never the only signal
export function AnswerOption(props: AnswerOptionProps) {
  return props.look === 'row' ? <AnswerRow {...props} /> : <AnswerCard {...props} />;
}

function AnswerCard({ label, onPress, indicator, state = 'default' }: AnswerOptionProps) {
  const styles = useStyles();
  const c = useColors();
  const isRadio = indicator === 'radio';
  const isDisabled = state === 'disabled';
  const isSelected = state === 'selected';
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.97);
  const popStyle = usePop(isSelected);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      accessibilityRole={isRadio ? 'radio' : 'checkbox'}
      accessibilityLabel={label}
      accessibilityState={isRadio ? { selected: isSelected, disabled: isDisabled } : { checked: isSelected, disabled: isDisabled }}
    >
      {({ pressed }) => {
        const look = looks(c)[state === 'default' && pressed ? 'pressed' : state];
        return (
          <Animated.View style={[styles.row, { backgroundColor: look.fill, borderColor: look.border, borderWidth: look.borderWidth }, bounceStyle]}>
            <Animated.View
              style={[
                popStyle,
                styles.indicator,
                { borderRadius: isRadio ? radius.pill : radius.small, backgroundColor: look.box, borderColor: look.boxBorder },
              ]}
            >
              {isSelected && isRadio ? <View style={styles.dot} /> : null}
              {isSelected && !isRadio ? <Icon name="check" size={sizes.icon.small} color={c.surface} /> : null}
            </Animated.View>
            <Text style={[styles.label, { color: look.label }]}>{label}</Text>
          </Animated.View>
        );
      }}
    </Pressable>
  );
}

// Selected rows slide a little to the right and fill in, and the mark on the right pops in. The mark,
// the slide and the bolder label all show the choice, so color is never the only signal
function AnswerRow({ label, onPress, indicator, state = 'default', letter }: AnswerOptionProps) {
  const styles = useStyles();
  const c = useColors();
  const reduced = useReducedMotion();
  const isRadio = indicator === 'radio';
  const isDisabled = state === 'disabled';
  const isSelected = state === 'selected';
  const popStyle = usePop(isSelected);
  const shift = useState(() => new Animated.Value(isSelected ? 1 : 0))[0];

  useEffect(() => {
    const to = isSelected ? 1 : 0;
    if (reduced) shift.setValue(to);
    else Animated.spring(shift, { toValue: to, speed: 16, bounciness: 12, useNativeDriver }).start();
  }, [isSelected, reduced, shift]);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole={isRadio ? 'radio' : 'checkbox'}
      accessibilityLabel={label}
      accessibilityState={isRadio ? { selected: isSelected, disabled: isDisabled } : { checked: isSelected, disabled: isDisabled }}
    >
      {({ pressed }) => (
        <View style={[styles.line, isSelected ? styles.lineSelected : pressed ? styles.linePressed : null]}>
          <Animated.View
            style={[
              styles.lineInner,
              { transform: [{ translateX: shift.interpolate({ inputRange: [0, 1], outputRange: [0, space[8]] }) }] },
            ]}
          >
            {letter ? <Text style={[styles.letter, isDisabled && styles.disabledText]}>{letter}</Text> : null}
            <Text style={[styles.label, styles.lineLabel, isSelected && styles.lineLabelSelected, isDisabled && styles.disabledText]}>
              {label}
            </Text>
            <View
              style={[
                styles.ring,
                { borderRadius: isRadio ? radius.pill : radius.small, borderColor: isSelected ? c.selected : isDisabled ? c.disabledInk : c.borderStrong },
              ]}
            >
              {isSelected ? (
                <Animated.View style={[styles.ringFill, { borderRadius: isRadio ? radius.pill : radius.small }, popStyle]}>
                  <Icon name="check" size={sizes.icon.small} color={c.onAccent} />
                </Animated.View>
              ) : null}
            </View>
          </Animated.View>
        </View>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  line: {
    minHeight: layout.minTouchTarget + space[4],
    justifyContent: 'center',
    borderBottomWidth: stroke.default,
    borderBottomColor: c.border,
    borderRadius: radius.small,
  },
  lineSelected: {
    backgroundColor: c.selectedSurface,
  },
  linePressed: {
    backgroundColor: c.surfaceWarm,
  },
  lineInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: space[8],
    paddingHorizontal: space[8],
  },
  letter: {
    ...type.title,
    fontFamily: fontFamily.display,
    width: space[16],
    color: c.highlight,
  },
  lineLabel: {
    color: c.ink,
  },
  lineLabelSelected: {
    fontFamily: fontFamily.bodySemiBold,
  },
  disabledText: {
    color: c.disabledInk,
  },
  ring: {
    width: sizes.answerIndicator + space[4],
    height: sizes.answerIndicator + space[4],
    borderWidth: stroke.strong,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ringFill: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.selected,
  },
  row: {
    minHeight: sizes.answerOptionMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: space[8],
    paddingHorizontal: space[16],
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
}));
