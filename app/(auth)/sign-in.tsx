import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { OrDivider } from '@/components/OrDivider';
import { Screen } from '@/components/Screen';
import { Tabs } from '@/components/Tabs';
import { TextInput } from '@/components/TextInput';
import { TopBar } from '@/components/TopBar';
import { colors, layout, space, type } from '@/constants/tokens';
import { isGoogleSignInAvailable, useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { signIn } from '@/lib/auth';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
// Same collage strip as Create account; the Week 8 Sign in design uses the same artwork
const footerArt = require('@/assets/images/auth-footer.png');
const FOOTER_ART_MAX_HEIGHT = 88;
const authTabs = [
  { key: 'create', label: 'Create account' },
  { key: 'sign-in', label: 'Sign in' },
];

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { isGoogleLoading, googleError, startGoogleSignIn } = useGoogleSignIn();
  const errorMessage = formError || googleError;

  const isValid = EMAIL_PATTERN.test(email.trim()) && password.length > 0;

  async function handleSubmit() {
    setFormError('');
    setIsSubmitting(true);
    const result = await signIn(email, password);
    setIsSubmitting(false);
    // On success the sign-in listener moves the person to the next screen
    if (!result.ok) {
      setFormError(result.message);
    }
  }

  function goToCreateAccount() {
    router.replace('/create-account');
  }

  return (
    <Screen compact>
      <View style={styles.topBar}>
        <TopBar onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Welcome back
        </Text>
        <Text style={styles.subtitle}>Pick up where you left off.</Text>
      </View>

      <Tabs tabs={authTabs} activeKey="sign-in" onChange={(key) => key === 'create' && goToCreateAccount()} />

      <TextInput
        label="Email"
        placeholder="name@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        isPassword
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
      />

      {errorMessage ? (
        <Text accessibilityLiveRegion="polite" style={styles.formError}>
          {errorMessage}
        </Text>
      ) : null}

      {/* Pushes the button toward the bottom of the screen, like the design */}
      <View style={styles.spacer} />

      <Button
        label={isSubmitting ? 'Signing in' : 'Sign in'}
        onPress={handleSubmit}
        state={isValid ? undefined : 'disabled'}
        loading={isSubmitting}
      />

      {isGoogleSignInAvailable ? (
        <>
          <OrDivider />

          <Button
            label={isGoogleLoading ? 'Opening Google' : 'Continue with Google'}
            onPress={startGoogleSignIn}
            style="secondary"
            loading={isGoogleLoading}
            state={isSubmitting ? 'disabled' : undefined}
          />
        </>
      ) : null}

      <Pressable
        onPress={goToCreateAccount}
        accessibilityRole="link"
        accessibilityLabel="New to Cuidance? Create account"
        style={styles.link}
      >
        <Text style={styles.linkLabel}>New to Cuidance? Create account</Text>
      </Pressable>

      <Image source={footerArt} style={styles.footerArt} contentFit="cover" contentPosition="top" accessible={false} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  // The back button lines up with the screen edge, like the design
  topBar: {
    marginHorizontal: -space[16],
  },
  header: {
    gap: space[4],
  },
  spacer: {
    flex: 2,
  },
  title: {
    ...type.heading,
    color: colors.light.ink,
  },
  subtitle: {
    ...type.body,
    color: colors.light.inkMuted,
  },
  formError: {
    ...type.body,
    color: colors.light.error,
  },
  link: {
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: {
    ...type.label,
    color: colors.light.accent,
  },
  // Shares any spare height at the bottom, and disappears on short screens so the form still fits
  footerArt: {
    flex: 1,
    minHeight: 0,
    maxHeight: FOOTER_ART_MAX_HEIGHT,
    marginHorizontal: -layout.screenEdge,
    marginBottom: -space[8],
  },
});
