import { StyleSheet, View } from 'react-native';

import type { IconName } from '@/components/Icon';
import { TabItem } from '@/components/TabItem';
import { radius, sizes, space, stroke } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

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
  const styles = useStyles();
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

// Floats above the page as a rounded Grounded Green bar (Nov 25 design), in both modes
const useStyles = makeStyles((_c, g) => StyleSheet.create({
  bar: {
    minHeight: sizes.tabBarHeight - space[16],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: space[12],
    marginTop: space[4],
    marginBottom: space[12],
    paddingVertical: space[8],
    paddingHorizontal: space[12],
    borderRadius: radius.pill,
    borderWidth: stroke.default,
    borderColor: g.navBorder,
    backgroundColor: g.nav,
    boxShadow: g.shadowPaper,
  },
}));
