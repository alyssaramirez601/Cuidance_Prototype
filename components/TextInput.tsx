import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput as NativeTextInput,
  View,
  type TextInputProps as NativeProps,
} from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, layout, radius, sizes, space, stroke, type } from '@/constants/tokens';

export type TextInputState = 'default' | 'focus' | 'error' | 'disabled';

type TextInputProps = Omit<NativeProps, 'style' | 'secureTextEntry' | 'editable'> & {
  label: string;
  // Leave out to follow real focus and the error message. Set it to pin a state, for example on the dev screen
  state?: TextInputState;
  error?: string;
  helper?: string;
  isPassword?: boolean;
};

const c = colors.light;

export function TextInput({
  label,
  state,
  error,
  helper,
  isPassword = false,
  onFocus,
  onBlur,
  ...inputProps
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHidden, setIsHidden] = useState(isPassword);

  const current: TextInputState = state ?? (error ? 'error' : isFocused ? 'focus' : 'default');
  const isDisabled = current === 'disabled';

  const borderColor =
    current === 'error' ? c.error : current === 'focus' ? c.accent : isDisabled ? c.border : c.borderStrong;
  const borderWidth = current === 'error' || current === 'focus' ? stroke.strong : stroke.default;

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: isDisabled ? c.disabledInk : c.ink }]}>{label}</Text>
      <View
        style={[styles.inputBox, { borderColor, borderWidth, backgroundColor: isDisabled ? c.disabledSurface : c.surface }]}
      >
        <NativeTextInput
          {...inputProps}
          editable={!isDisabled}
          style={[styles.input, { color: isDisabled ? c.disabledInk : c.ink }]}
          accessibilityLabel={label}
          placeholderTextColor={c.inkMuted}
          secureTextEntry={isHidden}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
        />
        {isPassword && !isDisabled ? (
          <Pressable
            onPress={() => setIsHidden((hidden) => !hidden)}
            accessibilityRole="button"
            accessibilityLabel={isHidden ? 'Show password' : 'Hide password'}
            style={styles.toggle}
          >
            <Text style={styles.toggleLabel}>{isHidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        ) : null}
      </View>
      {current === 'error' && error ? (
        <View style={styles.helperRow} accessibilityLiveRegion="polite">
          <Icon name="alert" size={sizes.icon.small} color={c.error} />
          <Text style={[styles.helper, { color: c.error }]}>{error}</Text>
        </View>
      ) : helper ? (
        <Text style={[styles.helper, { color: isDisabled ? c.disabledInk : c.inkMuted }]}>{helper}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: space[8],
  },
  label: {
    ...type.label,
  },
  inputBox: {
    minHeight: layout.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: space[16],
    borderRadius: radius.small,
  },
  input: {
    flex: 1,
    minHeight: layout.buttonHeight,
    paddingVertical: space[12],
    fontFamily: type.body.fontFamily,
    fontSize: type.body.fontSize,
  },
  toggle: {
    minWidth: layout.minTouchTarget,
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[12],
  },
  toggleLabel: {
    ...type.label,
    color: c.accent,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  helper: {
    ...type.caption,
    flexShrink: 1,
  },
});
