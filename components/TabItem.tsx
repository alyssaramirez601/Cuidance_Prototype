import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors, radius, sizes, space, type } from '@/constants/tokens';

export type TabItemState = 'default' | 'active';

type TabItemProps = {
  label: string;
  icon: IconName;
  onPress: () => void;
  state?: TabItemState;
};

const c = colors.light;

export function TabItem({ label, icon, onPress, state = 'default' }: TabItemProps) {
  const isActive = state === 'active';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
      style={styles.item}
    >
      <View style={[styles.pill, isActive && styles.pillActive]}>
        <Icon name={icon} size={sizes.icon.large} color={isActive ? c.selected : c.inkMuted} />
      </View>
      <Text style={[styles.label, { color: isActive ? c.selected : c.inkMuted }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    width: sizes.tabItemWidth,
    minHeight: sizes.tabItemHeight,
    alignItems: 'center',
    gap: space[4],
  },
  pill: {
    width: sizes.tabPillWidth,
    height: sizes.tabPillHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[4],
    paddingHorizontal: space[12],
    borderRadius: radius.pill,
  },
  pillActive: {
    backgroundColor: c.selectedSurface,
  },
  label: {
    ...type.caption,
  },
});
