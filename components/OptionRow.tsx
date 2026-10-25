import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, layout, radius, space, stroke, type } from '@/constants/tokens';

type OptionRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

// A check mark and a thicker outline show the choice, so color is never the only signal
export function OptionRow({ label, selected, onPress }: OptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      style={[styles.row, selected && styles.rowSelected]}
    >
      <View style={[styles.box, selected && styles.boxSelected]}>
        {selected ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: layout.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    paddingVertical: space[12],
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: colors.light.borderStrong,
    backgroundColor: colors.light.surface,
  },
  rowSelected: {
    borderWidth: stroke.strong,
    borderColor: colors.light.selected,
    backgroundColor: colors.light.selectedSurface,
  },
  box: {
    width: space[24],
    height: space[24],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.small,
    borderWidth: stroke.default,
    borderColor: colors.light.borderStrong,
    backgroundColor: colors.light.surface,
  },
  boxSelected: {
    borderColor: colors.light.selected,
    backgroundColor: colors.light.selected,
  },
  check: {
    ...type.label,
    color: colors.light.onAccent,
  },
  label: {
    ...type.body,
    flex: 1,
    color: colors.light.ink,
  },
});
