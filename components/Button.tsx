import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, layout, radius, space, stroke, type } from '@/constants/tokens';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
};

export function Button({ label, onPress, variant = 'primary', disabled = false, loading = false }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isInactive = disabled || loading;
  const textColor = isInactive ? colors.light.disabledInk : isPrimary ? colors.light.onAccent : colors.light.ink;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        isInactive && styles.inactive,
        pressed && styles.pressed,
      ]}
    >
      {loading ? <ActivityIndicator color={textColor} /> : null}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
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
    paddingHorizontal: space[24],
    borderRadius: radius.pill,
    borderWidth: stroke.default,
  },
  primary: {
    backgroundColor: colors.light.accent,
    borderColor: colors.light.accent,
  },
  secondary: {
    backgroundColor: colors.light.surface,
    borderColor: colors.light.borderStrong,
  },
  inactive: {
    backgroundColor: colors.light.disabledSurface,
    borderColor: colors.light.disabledSurface,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...type.label,
  },
});
