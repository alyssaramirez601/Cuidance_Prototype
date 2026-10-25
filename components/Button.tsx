import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, layout, radius, space, stroke, type } from '@/constants/tokens';

export type ButtonStyle = 'primary' | 'secondary' | 'ghost';
export type ButtonState = 'default' | 'hover' | 'pressed' | 'disabled';

type ButtonProps = {
  label: string;
  onPress: () => void;
  style?: ButtonStyle;
  // Leave out to follow the real press. Set it to pin a state, for example on the dev screen
  state?: ButtonState;
  loading?: boolean;
};

type Look = { fill: string; border: string | null; text: string };

const c = colors.light;

// One row per Figma Style and State, from docs/design-system/components.md
const looks: Record<ButtonStyle, Record<ButtonState, Look>> = {
  primary: {
    default: { fill: c.accent, border: null, text: c.onAccent },
    hover: { fill: c.accentHover, border: null, text: c.onAccent },
    pressed: { fill: c.accentPressed, border: null, text: c.onAccent },
    disabled: { fill: c.disabledSurface, border: null, text: c.disabledInk },
  },
  secondary: {
    default: { fill: c.surface, border: c.accent, text: c.accent },
    hover: { fill: c.background, border: c.accent, text: c.accent },
    pressed: { fill: c.border, border: c.accent, text: c.accent },
    disabled: { fill: c.surface, border: c.disabledInk, text: c.disabledInk },
  },
  ghost: {
    default: { fill: 'transparent', border: null, text: c.accent },
    hover: { fill: c.background, border: null, text: c.accent },
    pressed: { fill: c.border, border: null, text: c.accent },
    disabled: { fill: 'transparent', border: null, text: c.disabledInk },
  },
};

export function Button({ label, onPress, style = 'primary', state, loading = false }: ButtonProps) {
  const isDisabled = state === 'disabled' || loading;

  function lookFor(pressed: boolean): Look {
    const current: ButtonState = isDisabled ? 'disabled' : (state ?? (pressed ? 'pressed' : 'default'));
    return looks[style][current];
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => {
        const look = lookFor(pressed);
        return [
          styles.base,
          {
            backgroundColor: look.fill,
            borderColor: look.border ?? 'transparent',
            borderWidth: look.border ? stroke.default : 0,
          },
        ];
      }}
    >
      {({ pressed }) => {
        const textColor = lookFor(pressed).text;
        return (
          <>
            {loading ? <ActivityIndicator color={textColor} /> : null}
            <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[8],
    paddingVertical: space[12],
    paddingHorizontal: space[24],
    borderRadius: radius.pill,
  },
  label: {
    ...type.label,
  },
});
