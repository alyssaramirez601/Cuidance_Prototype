import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TabBar, type TabId } from '@/components/TabBar';
import { colors } from '@/constants/tokens';

const tabIds: TabId[] = ['home', 'explore', 'saved', 'shop', 'profile'];

// The five main tabs, in the fixed order from CLAUDE.md. Uses the app's own TabBar component
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.light.background } }}
      tabBar={({ state, navigateToTab }) => {
        const active = (state.routes[state.index]?.name ?? 'home') as TabId;
        const keyFor = (tab: TabId) => state.routes.find((route) => route.name === tab)?.key;
        return (
          <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.light.surface }}>
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
