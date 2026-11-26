import type { PressableStateCallbackType } from 'react-native';

// React Native Web passes `focused` to a Pressable's style function when the keyboard lands on it.
// The phone types leave it out, so this reads it safely. Used to draw a visible focus ring on the web
export function isFocused(state: PressableStateCallbackType): boolean {
  return Boolean((state as PressableStateCallbackType & { focused?: boolean }).focused);
}
