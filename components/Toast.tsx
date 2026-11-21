import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { radius, sizes, space, stroke, type } from '@/constants/tokens';
import { type Palette, makeStyles, useColors } from '@/hooks/useTheme';

export type ToastType = 'success' | 'error';

type ToastProps = {
  type: ToastType;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

const looks = (c: Palette) => ({
  success: { fill: c.successSurface, border: c.success, icon: 'check' },
  error: { fill: c.errorSurface, border: c.error, icon: 'alert' },
} as const);

export function Toast({ type: toastType, message, actionLabel, onActionPress }: ToastProps) {
  const c = useColors();
  const styles = useStyles();
  const look = looks(c)[toastType];
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.toast, { backgroundColor: look.fill, borderColor: look.border }]}
    >
      <Icon name={look.icon} size={sizes.icon.medium} color={look.border} />
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} accessibilityRole="button" accessibilityLabel={actionLabel}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  toast: {
    minHeight: sizes.toastMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: space[12],
    paddingHorizontal: space[16],
    borderRadius: radius.medium,
    borderWidth: stroke.default,
  },
  message: {
    ...type.body,
    flex: 1,
    color: c.ink,
  },
  action: {
    ...type.label,
    color: c.accent,
  },
}));
