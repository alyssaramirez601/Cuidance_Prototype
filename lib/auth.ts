import type { AuthError } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';

export type AuthResult = { ok: true } | { ok: false; message: string };
// Closing the Google screen is not an error, so it gets its own result
export type GoogleSignInResult = AuthResult | { ok: true; cancelled: true };

// Plain-language messages only, so people never see raw error codes
function friendlyMessage(error: AuthError): string {
  if (error.name === 'AuthRetryableFetchError') {
    return 'We couldn’t reach Cuidance. Check your connection and try again.';
  }
  switch (error.code) {
    case 'invalid_credentials':
      return 'That email and password don’t match. Check them and try again.';
    case 'user_already_exists':
    case 'email_exists':
      return 'An account with this email already exists. Try signing in instead.';
    case 'weak_password':
      return 'Please choose a stronger password with at least 8 characters.';
    case 'email_address_invalid':
      return 'That email address doesn’t look right. Check it and try again.';
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'Too many tries in a short time. Wait a minute and try again.';
    default:
      return 'Something went wrong on our side. Please try again.';
  }
}

export async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    // The profile trigger in the database saves this as the profile's display_name
    options: { data: { display_name: name.trim() } },
  });
  if (error) {
    return { ok: false, message: friendlyMessage(error) };
  }
  if (!data.session) {
    return { ok: false, message: 'Your account was created. Check your email to confirm it, then sign in.' };
  }
  return { ok: true };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) {
    return { ok: false, message: friendlyMessage(error) };
  }
  return { ok: true };
}

const GOOGLE_ERROR = 'We couldn’t sign you in with Google. Please try again.';

// Where Google sends the person back to. These must match the redirect URLs saved in Supabase
function googleRedirectUrl(): string {
  if (Platform.OS === 'web') {
    // The live app sits under a base path on GitHub Pages. Local dev has none
    const basePath = Constants.expoConfig?.experiments?.baseUrl ?? '';
    return `${window.location.origin}${basePath}/`;
  }
  return Linking.createURL('/');
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  const redirectTo = googleRedirectUrl();
  const isWeb = Platform.OS === 'web';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    // On the web the browser itself goes to Google and comes back. On a phone we open it ourselves
    options: { redirectTo, skipBrowserRedirect: !isWeb },
  });
  if (error || !data.url) {
    return { ok: false, message: GOOGLE_ERROR };
  }
  if (isWeb) {
    return { ok: true };
  }

  const browserResult = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (browserResult.type !== 'success') {
    return { ok: true, cancelled: true };
  }

  const returnedUrl = new URL(browserResult.url);
  const code = returnedUrl.searchParams.get('code');
  if (!code) {
    // Google or Supabase sent back an error instead of a code, for example if access was denied
    return returnedUrl.searchParams.get('error') === 'access_denied'
      ? { ok: true, cancelled: true }
      : { ok: false, message: GOOGLE_ERROR };
  }
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return { ok: false, message: GOOGLE_ERROR };
  }
  return { ok: true };
}

export async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { ok: false, message: 'We couldn’t sign you out. Please try again.' };
  }
  return { ok: true };
}
