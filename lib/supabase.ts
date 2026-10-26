import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase is not set up yet. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env, then restart Expo.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Keeps the person signed in on the phone between app launches
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // Google sign-in sends the person back with a one-time code, exchanged for a session
    flowType: 'pkce',
    // On the web the app reads that code from the address bar. A phone app has no such address
    detectSessionInUrl: Platform.OS === 'web',
  },
});

// Only refresh the session while the app is open, so a backgrounded app stays quiet
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
