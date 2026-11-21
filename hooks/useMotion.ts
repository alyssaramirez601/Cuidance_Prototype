import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Platform } from 'react-native';

// Bounce and entrance motion (Nov 20, 2026). Everything here turns itself off when the phone's
// Reduce Motion setting is on, so motion is never needed to understand or use a screen.

export const useNativeDriver = Platform.OS !== 'web';

/** True when the person has asked their phone for less motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((on) => alive && setReduced(on))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);
  return reduced;
}

/** A soft squish on press and a springy release. Spread onPressIn and onPressOut on the Pressable. */
export function usePressBounce(pressedScale = 0.95) {
  const reduced = useReducedMotion();
  const scale = useState(() => new Animated.Value(1))[0];
  return {
    bounceStyle: { transform: [{ scale }] },
    onPressIn: () => {
      if (reduced) return;
      Animated.spring(scale, { toValue: pressedScale, speed: 40, bounciness: 0, useNativeDriver }).start();
    },
    onPressOut: () => {
      if (reduced) return;
      Animated.spring(scale, { toValue: 1, speed: 14, bounciness: 14, useNativeDriver }).start();
    },
  };
}

/** A quick pop (grow past full size, settle back) whenever `trigger` turns true. */
export function usePop(trigger: boolean) {
  const reduced = useReducedMotion();
  const scale = useState(() => new Animated.Value(1))[0];
  useEffect(() => {
    if (!trigger || reduced) return;
    scale.setValue(0.6);
    Animated.spring(scale, { toValue: 1, speed: 16, bounciness: 16, useNativeDriver }).start();
  }, [trigger, reduced, scale]);
  return { transform: [{ scale }] };
}
