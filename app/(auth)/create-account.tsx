import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextInput } from '@/components/TextInput';
import { colors, layout, space, type } from '@/constants/tokens';
import { signUp } from '@/lib/auth';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function CreateAccountScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const isValid = EMAIL_PATTERN.test(email.trim()) && password.length >= MIN_PASSWORD_LENGTH;

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
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Create your account
        </Text>
        <Text style={styles.subtitle}>Take the quiz and save your guidance.</Text>
      </View>

      <TextInput
        label="Name (optional)"
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

      {formError ? (
        <Text accessibilityLiveRegion="polite" style={styles.formError}>
          {formError}
        </Text>
      ) : null}

      <Button
        label={isSubmitting ? 'Creating account' : 'Create account'}
        onPress={handleSubmit}
        state={isValid ? undefined : 'disabled'}
        loading={isSubmitting}
      />

      <Pressable
        onPress={() => router.replace('/sign-in')}
        accessibilityRole="link"
        accessibilityLabel="Already have an account? Sign in"
        style={styles.link}
      >
        <Text style={styles.linkLabel}>Already have an account? Sign in</Text>
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
