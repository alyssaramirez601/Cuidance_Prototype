import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HelpButton } from '@/components/HelpButton';
import { Icon } from '@/components/Icon';
import { colors, layout, sizes, space, type } from '@/constants/tokens';

type TopBarProps = {
  onBack: () => void;
  onHelp: () => void;
};

export function TopBar({ onBack, onHelp }: TopBarProps) {
  return (
    <View style={styles.bar}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" style={styles.back}>
        <Icon name="back" size={sizes.icon.large} color={colors.light.ink} />
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>
      <HelpButton onPress={onHelp} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: sizes.topBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space[8],
    paddingHorizontal: space[16],
    backgroundColor: colors.light.background,
  },
  back: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  backLabel: {
    ...type.label,
    color: colors.light.ink,
  },
});
