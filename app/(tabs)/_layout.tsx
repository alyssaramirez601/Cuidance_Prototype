import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TabBar, type TabId } from '@/components/TabBar';

import { useTheme } from '@/hooks/useTheme';

const tabIds: TabId[] = ['home', 'explore', 'saved', 'shop', 'profile'];

// The five main tabs, in the fixed order from CLAUDE.md. Uses the app's own TabBar component
export default function TabsLayout() {
  const { c, g } = useTheme();
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.background } }}
      tabBar={({ state, navigateToTab }) => {
        const active = (state.routes[state.index]?.name ?? 'home') as TabId;
        const keyFor = (tab: TabId) => state.routes.find((route) => route.name === tab)?.key;
        return (
          // Behind the floating bar is the page's own color, so it looks like it hovers over the page
          <SafeAreaView edges={['bottom']} style={{ backgroundColor: active === 'explore' ? g.explorePage : c.background }}>
            <TabBar
              active={active}
              onSelect={(tab) => {
                const key = keyFor(tab);
                if (key) navigateToTab(key);
              }}
            />
          </SafeAreaView>
        );
      }}
    >
      {tabIds.map((id) => (
        <Tabs.Screen key={id} name={id} />
      ))}
    </Tabs>
  );
}
