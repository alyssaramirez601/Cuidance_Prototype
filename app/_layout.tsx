import { Archivo_400Regular, Archivo_600SemiBold } from '@expo-google-fonts/archivo';
import { Newsreader_400Regular } from '@expo-google-fonts/newsreader';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { LoadingState } from '@/components/LoadingState';
import { colors, fontFamily } from '@/constants/tokens';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout() {
  const { session, isLoading } = useAuth();
  // Registered under the fontFamily names in tokens.ts, so screens never name a font file
  const [fontsLoaded, fontError] = useFonts({
    [fontFamily.display]: Newsreader_400Regular,
    [fontFamily.body]: Archivo_400Regular,
    [fontFamily.bodySemiBold]: Archivo_600SemiBold,
  });

  // If the fonts fail to load the app still opens, with the phone's default font
  if (isLoading || (!fontsLoaded && !fontError)) {
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
          <Stack.Screen name="dev" />
          <Stack.Screen name="quiz/[questionId]" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
