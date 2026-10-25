import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors, layout, space, type } from '@/constants/tokens';
import { signIn } from '@/lib/auth';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

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

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Welcome back
        </Text>
        <Text style={styles.subtitle}>Pick up where you left off.</Text>
      </View>

      <TextField
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
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        isPassword
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
      />

      {formError ? (
        <Text accessibilityLiveRegion="polite" style={styles.formError}>
          {formError}
        </Text>
      ) : null}

      <Button
        label={isSubmitting ? 'Signing in' : 'Sign in'}
        onPress={handleSubmit}
        disabled={!isValid}
        loading={isSubmitting}
      />

      <Pressable
        onPress={() => router.replace('/create-account')}
        accessibilityRole="link"
        accessibilityLabel="New to Cuidance? Create account"
        style={styles.link}
      >
        <Text style={styles.linkLabel}>New to Cuidance? Create account</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: space[8],
    marginBottom: space[8],
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
});
