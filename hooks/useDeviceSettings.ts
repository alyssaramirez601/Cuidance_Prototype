import { useCallback, useEffect, useState } from 'react';

import { loadSettings, saveSettings, type SettingsKind } from '@/lib/profile';

type SaveState = { status: 'idle' } | { status: 'saving' } | { status: 'saved' } | { status: 'error'; message: string };

// Privacy and notification choices: load, flip one, save. Kept on this phone for the beta
export function useDeviceSettings(kind: SettingsKind, userId: string) {
  const [values, setValues] = useState<boolean[] | null>(null);
  const [save, setSave] = useState<SaveState>({ status: 'idle' });

  useEffect(() => {
    let active = true;
    loadSettings(kind, userId).then((loaded) => {
      if (active) setValues(loaded);
    });
    return () => {
      active = false;
    };
  }, [kind, userId]);

  const toggle = useCallback((index: number) => {
    setSave({ status: 'idle' });
    setValues((current) => current && current.map((value, i) => (i === index ? !value : value)));
  }, []);

  const persist = useCallback(async () => {
    if (!values) return;
    setSave({ status: 'saving' });
    const result = await saveSettings(kind, userId, values);
    setSave(result.ok ? { status: 'saved' } : { status: 'error', message: result.message });
  }, [kind, userId, values]);

  return { values, toggle, persist, save };
}
