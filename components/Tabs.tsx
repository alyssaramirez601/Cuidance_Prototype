import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, layout, space, stroke, type } from '@/constants/tokens';

type Tab = {
  key: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
};

const c = colors.light;

// Underlined tabs at the top of a screen, like Create account | Sign in in the Week 8 design.
// Not in the Figma design system yet, so Esme should add it there
export function Tabs({ tabs, activeKey, onChange }: TabsProps) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.label, { color: isActive ? c.selected : c.inkMuted }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: stroke.default,
    borderBottomColor: c.border,
  },
  tab: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    // Keeps the label in the same spot whether or not the tab is active
    borderBottomWidth: stroke.strong,
    borderBottomColor: 'transparent',
    marginBottom: -stroke.default,
  },
  tabActive: {
    borderBottomColor: c.selected,
  },
  label: {
    ...type.label,
  },
});
