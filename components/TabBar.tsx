import { StyleSheet, View } from 'react-native';

import type { IconName } from '@/components/Icon';
import { TabItem } from '@/components/TabItem';
import { colors, sizes, space, stroke } from '@/constants/tokens';

// Order is fixed by the design system. A team decision on merging tabs is still pending (see CLAUDE.md)
const tabs: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'explore', label: 'Explore', icon: 'explore' },
  { id: 'saved', label: 'Saved', icon: 'saved' },
  { id: 'shop', label: 'Shop', icon: 'shop' },
  { id: 'profile', label: 'Profile', icon: 'profile' },
];

export type TabId = 'home' | 'explore' | 'saved' | 'shop' | 'profile';

type TabBarProps = {
  active: TabId;
  onSelect: (tab: TabId) => void;
};

export function TabBar({ active, onSelect }: TabBarProps) {
  return (
    <View accessibilityRole="tablist" style={styles.bar}>
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          label={tab.label}
          icon={tab.icon}
          state={tab.id === active ? 'active' : 'default'}
          onPress={() => onSelect(tab.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: sizes.tabBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: space[8],
    paddingHorizontal: space[16],
    borderTopWidth: stroke.default,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
});
