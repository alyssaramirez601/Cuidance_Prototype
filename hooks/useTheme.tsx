import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { colors, graphic } from '@/constants/tokens';

// Light and dark mode (Nov 20, 2026). People pick System, Light or Dark in Profile › Account.
// System follows the phone. The choice is saved on the device only.

export type Scheme = 'light' | 'dark';
export type AppearancePreference = 'system' | 'light' | 'dark';
export type Palette = { [K in keyof typeof colors.light]: string };
export type GraphicPalette = { [K in keyof typeof graphic.light]: string };

const STORAGE_KEY = 'cuidance.appearance';

type ThemeValue = {
  scheme: Scheme;
  preference: AppearancePreference;
  setPreference: (next: AppearancePreference) => void;
  c: Palette;
  g: GraphicPalette;
};

const ThemeContext = createContext<ThemeValue>({
  scheme: 'light',
  preference: 'system',
  setPreference: () => {},
  c: colors.light,
  g: graphic.light,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<AppearancePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark' || saved === 'system') setPreferenceState(saved);
      })
      .catch(() => {});
  }, []);

  const setPreference = useCallback((next: AppearancePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const scheme: Scheme = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
  const value = useMemo(
    () => ({ scheme, preference, setPreference, c: colors[scheme], g: graphic[scheme] }),
    [scheme, preference, setPreference],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** The color roles for the current light or dark scheme. */
export function useColors(): Palette {
  return useContext(ThemeContext).c;
}

/**
 * Styles that follow light and dark mode. Write the factory once at module level, call the
 * returned hook inside the component: `const styles = useStyles();`
 */
export function makeStyles<T>(factory: (c: Palette, g: GraphicPalette) => T) {
  const cache: Partial<Record<Scheme, T>> = {};
  return function useStyles(): T {
    const { scheme } = useContext(ThemeContext);
    const hit = cache[scheme];
    if (hit) return hit;
    const made = factory(colors[scheme], graphic[scheme]);
    cache[scheme] = made;
    return made;
  };
}
