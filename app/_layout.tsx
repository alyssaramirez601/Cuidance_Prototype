import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { LoadingState } from '@/components/LoadingState';
import { colors } from '@/constants/tokens';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState label="Loading Cuidance" />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.light.background },
        }}
      >
        {/* Signed-out people can only reach these screens */}
        <Stack.Protected guard={!session}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/create-account" />
          <Stack.Screen name="(auth)/sign-in" />
        </Stack.Protected>
        {/* Signed-in people can only reach these screens */}
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="proof" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
