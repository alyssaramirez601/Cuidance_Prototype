import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, layout, space, stroke, type } from "@/constants/tokens";

type Tab = {
  key: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  // For more tabs than fit: they keep their natural width and the row scrolls sideways,
  // with the next tab peeking in at the edge so it's clear there's more
  scrollable?: boolean;
};

const c = colors.light;

// Underlined tabs at the top of a screen, like Create account | Sign in in the Week 8 design.
// Not in the Figma design system yet, so Esme should add it there
export function Tabs({
  tabs,
  activeKey,
  onChange,
  scrollable = false,
}: TabsProps) {
  const items = tabs.map((tab) => {
    const isActive = tab.key === activeKey;
    return (
      <Pressable
        key={tab.key}
        onPress={() => onChange(tab.key)}
        accessibilityRole="tab"
        accessibilityLabel={tab.label}
        accessibilityState={{ selected: isActive }}
        style={[
          styles.tab,
          scrollable && styles.tabScroll,
          isActive && styles.tabActive,
        ]}
      >
        <Text
          style={[styles.label, { color: isActive ? c.selected : c.inkMuted }]}
        >
          {tab.label}
        </Text>
      </Pressable>
    );
  });
  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        accessibilityRole="tablist"
      >
        {items}
      </ScrollView>
    );
  }
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {items}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: stroke.default,
    borderBottomColor: c.border,
  },
  tab: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    // Keeps the label in the same spot whether or not the tab is active
    borderBottomWidth: stroke.strong,
    borderBottomColor: "transparent",
    marginBottom: -stroke.default,
  },
  // flex: 0 squeezes the tabs to nothing on the web, so each one keeps its natural width instead
  tabScroll: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    paddingHorizontal: space[12],
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
    borderBottomWidth: stroke.default,
    borderBottomColor: c.border,
  },
  scrollContent: {
    paddingHorizontal: space[12],
  },
  tabActive: {
    borderBottomColor: c.selected,
  },
  label: {
    ...type.label,
  },
});
