import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { OrDivider } from '@/components/OrDivider';
import { PrivacySheet } from '@/components/PrivacySheet';
import { Screen } from '@/components/Screen';
import { Tabs } from '@/components/Tabs';
import { TextInput } from '@/components/TextInput';
import { TopBar } from '@/components/TopBar';
import { colors, layout, space, type } from '@/constants/tokens';
import { isGoogleSignInAvailable, useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { signUp } from '@/lib/auth';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const MIN_PASSWORD_LENGTH = 8;
const PRIVACY_LABEL = 'I\u2019ve reviewed Privacy & Trust. My answers are used to shape my guidance, and my data is not sold.';
// Cut from the bottom of the Week 8 hi-fi "02 · Create account" design
const footerArt = require('@/assets/images/auth-footer.png');
// The strip never grows past its height in the design
const FOOTER_ART_MAX_HEIGHT = 88;
const authTabs = [
  { key: 'create', label: 'Create account' },
  { key: 'sign-in', label: 'Sign in' },
];

export default function CreateAccountScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Starts unchecked (CLAUDE.md forms rule)
  const [agreed, setAgreed] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { isGoogleLoading, googleError, startGoogleSignIn } = useGoogleSignIn();
  const errorMessage = formError || googleError;

  const isValid =
    name.trim().length > 0 &&
    EMAIL_PATTERN.test(email.trim()) &&
    password.length >= MIN_PASSWORD_LENGTH &&
    agreed;

  function goToSignIn() {
    router.replace('/sign-in');
  }

  async function handleSubmit() {
    setFormError('');
    setIsSubmitting(true);
    const result = await signUp(name, email, password);
    setIsSubmitting(false);
    // On success the sign-in listener moves the person to the next screen
    if (!result.ok) {
      setFormError(result.message);
    }
  }

  return (
    <Screen compact>
      <View style={styles.topBar}>
        <TopBar onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Create your account
        </Text>
        <Text style={styles.subtitle}>Take the quiz and save your guidance.</Text>
      </View>

      <Tabs tabs={authTabs} activeKey="create" onChange={(key) => key === 'sign-in' && goToSignIn()} />

      <TextInput
        label="Name"
        placeholder="Your first name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="given-name"
        textContentType="givenName"
      />
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
        helper="At least 8 characters"
        value={password}
        onChangeText={setPassword}
        isPassword
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
      />

      <Checkbox
        label={PRIVACY_LABEL}
        state={agreed ? 'checked' : 'unchecked'}
        onPress={() => setAgreed((value) => !value)}
        linkText="Privacy & Trust"
        onLinkPress={() => setShowPrivacy(true)}
      />

      {errorMessage ? (
        <Text accessibilityLiveRegion="polite" style={styles.formError}>
          {errorMessage}
        </Text>
      ) : null}

      <Button
        label={isSubmitting ? 'Creating account' : 'Create account'}
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
        onPress={goToSignIn}
        accessibilityRole="link"
        accessibilityLabel="Already have an account? Sign in"
        style={styles.link}
      >
        <Text style={styles.linkLabel}>Already have an account? Sign in</Text>
      </Pressable>

      <Image source={footerArt} style={styles.footerArt} contentFit="cover" contentPosition="top" accessible={false} />

      <PrivacySheet
        visible={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        onUnderstand={() => {
          setAgreed(true);
          setShowPrivacy(false);
        }}
      />
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
