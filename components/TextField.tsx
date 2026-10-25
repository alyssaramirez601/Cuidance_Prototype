import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, layout, radius, space, stroke, type } from '@/constants/tokens';

type TextFieldProps = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label: string;
  error?: string;
  helper?: string;
  isPassword?: boolean;
};

export function TextField({ label, error, helper, isPassword = false, onFocus, onBlur, ...inputProps }: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHidden, setIsHidden] = useState(isPassword);

  const borderColor = error ? colors.light.error : isFocused ? colors.light.accent : colors.light.borderStrong;
  const borderWidth = error || isFocused ? stroke.strong : stroke.default;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputBox, { borderColor, borderWidth }]}>
        <TextInput
          {...inputProps}
          style={styles.input}
          accessibilityLabel={label}
          placeholderTextColor={colors.light.inkMuted}
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
        {isPassword ? (
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
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
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
    color: colors.light.ink,
  },
  inputBox: {
    minHeight: layout.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: space[16],
    borderRadius: radius.small,
    backgroundColor: colors.light.surface,
  },
  input: {
    flex: 1,
    minHeight: layout.buttonHeight,
    fontFamily: type.body.fontFamily,
    fontSize: type.body.fontSize,
    color: colors.light.ink,
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
    color: colors.light.accent,
  },
  helper: {
    ...type.caption,
    color: colors.light.inkMuted,
  },
  error: {
    ...type.caption,
    color: colors.light.error,
  },
});
