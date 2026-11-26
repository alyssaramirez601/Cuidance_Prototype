import { type ReactNode, useEffect, useState } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

import { useNativeDriver, useReducedMotion } from '@/hooks/useMotion';

type AppearProps = {
  children: ReactNode;
  // Position in the stack of things arriving on this screen, so they come in one after another
  order?: number;
  style?: StyleProp<ViewStyle>;
};

const STAGGER_MS = 70;

// The one entrance animation: rise a little, overshoot, settle. Shows straight away with Reduce Motion on
export function Appear({ children, order = 0, style }: AppearProps) {
  const reduced = useReducedMotion();
  const progress = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    Animated.spring(progress, {
      toValue: 1,
      delay: order * STAGGER_MS,
      speed: 10,
      bounciness: 9,
      useNativeDriver,
    }).start();
  }, [order, progress, reduced]);

  const opacity = progress.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1], extrapolate: 'clamp' });
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] });

  return <Animated.View style={[style, { opacity, transform: [{ translateY }, { scale }] }]}>{children}</Animated.View>;
}
