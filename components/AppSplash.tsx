import { useEffect, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { fontFamily, space, type } from '@/constants/tokens';
import { useNativeDriver, useReducedMotion } from '@/hooks/useMotion';
import { makeStyles, useTheme } from '@/hooks/useTheme';

export type SplashVariant = 'full' | 'quick';

type AppSplashProps = {
  variant: SplashVariant;
  firstName: string;
  onDone: () => void;
};

// Splash 6 from the Nov 20 redesign canvas. The art is Alyssa's layered SVG, exported one layer per
// image (with its screen-print grain) so the phone moves a few pictures instead of thousands of dots.
// The art was drawn on a 390 x 844 frame; each layer keeps that frame's position, scaled to the screen width.
const ART_W = 390;
const ART_H = 844;
const LAYERS = [
  { key: 'terracotta', x: 86, y: 432, w: 304, h: 412 },
  { key: 'olive', x: 72, y: 600, w: 318, h: 244 },
  { key: 'botanical', x: 0, y: 420, w: 193, h: 288 },
  { key: 'clay', x: 0, y: 636, w: 390, h: 208 },
  { key: 'blue', x: 0, y: 680, w: 390, h: 164 },
] as const;

const ART = {
  light: {
    terracotta: require('@/assets/splash/terracotta-light.png'),
    olive: require('@/assets/splash/olive-light.png'),
    botanical: require('@/assets/splash/botanical-light.png'),
    clay: require('@/assets/splash/clay-light.png'),
    blue: require('@/assets/splash/blue-light.png'),
    bowl: require('@/assets/splash/mark-bowl-green.png'),
    circle: require('@/assets/splash/mark-circle.png'),
    word: require('@/assets/splash/wordmark-green.png'),
  },
  dark: {
    terracotta: require('@/assets/splash/terracotta-dark.png'),
    olive: require('@/assets/splash/olive-dark.png'),
    botanical: require('@/assets/splash/botanical-dark.png'),
    clay: require('@/assets/splash/clay-dark.png'),
    blue: require('@/assets/splash/blue-dark.png'),
    bowl: require('@/assets/splash/mark-bowl-light.png'),
    circle: require('@/assets/splash/mark-circle-light.png'),
    word: require('@/assets/splash/wordmark-light.png'),
  },
};
const GRAIN = require('@/assets/splash/grain.png');

// The mark's two pieces, cut from assets/logo/logo-horizontal-green.png (255 x 211 at full size),
// shown at half size so the 3x phone screens stay sharp
const MARK = 0.5;
const BOWL = { left: 0, top: 75 * MARK, width: 255 * MARK, height: 136 * MARK };
const CIRCLE = { left: 85 * MARK, top: 0, width: 90 * MARK, height: 85 * MARK };
const WORD = { width: 220, height: 220 * (163 / 723) };

const HOLD_MS = { full: 380, quick: 160 };

// The circle tries on brand colors as it bounces, then lands as the real logo. The color moments are
// tinted copies of the logo's own circle, so the shape is never redrawn (approved by Alyssa, Nov 20)
export function AppSplash({ variant, firstName, onDone }: AppSplashProps) {
  const { scheme, c, g } = useTheme();
  const styles = useStyles();
  const reduced = useReducedMotion();
  const { width } = useWindowDimensions();
  const art = ART[scheme];
  const scale = width / ART_W;
  const full = variant === 'full' && !reduced;

  const layer = useState(() => LAYERS.map(() => new Animated.Value(full ? 1 : 0)))[0];
  const bowlIn = useState(() => new Animated.Value(full ? 0 : 1))[0];
  const drop = useState(() => new Animated.Value(0))[0]; // 0 = above, 1 = resting in the bowl
  const squash = useState(() => new Animated.Value(0))[0];
  const tint = useState(() => new Animated.Value(full ? 0 : 2))[0]; // 0 terracotta, 1 blue, 2 the real logo
  const ring1 = useState(() => new Animated.Value(0))[0];
  const ring2 = useState(() => new Animated.Value(0))[0];
  const words = useState(() => new Animated.Value(0))[0];
  const fadeOut = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    const finish = () =>
      Animated.timing(fadeOut, { toValue: 0, duration: 220, delay: HOLD_MS[variant], useNativeDriver }).start(() => onDone());

    if (reduced) {
      drop.setValue(1);
      tint.setValue(2);
      words.setValue(1);
      const id = setTimeout(finish, 400);
      return () => clearTimeout(id);
    }

    const spring = (v: Animated.Value, delay: number) =>
      Animated.spring(v, { toValue: 0, delay, speed: 9, bounciness: 7, useNativeDriver });
    const hit = () =>
      Animated.sequence([
        Animated.timing(squash, { toValue: 1, duration: 70, useNativeDriver }),
        Animated.spring(squash, { toValue: 0, speed: 20, bounciness: 12, useNativeDriver }),
      ]);
    const ring = (v: Animated.Value, delay: number) =>
      Animated.timing(v, { toValue: 1, duration: 650, delay, easing: Easing.out(Easing.quad), useNativeDriver });
    const fall = (to: number, ms: number) =>
      Animated.timing(drop, { toValue: to, duration: ms, easing: Easing.in(Easing.quad), useNativeDriver });
    const rise = (to: number, ms: number) =>
      Animated.timing(drop, { toValue: to, duration: ms, easing: Easing.out(Easing.quad), useNativeDriver });

    const ball = full
      ? Animated.sequence([
          Animated.delay(300),
          fall(1, 320),
          Animated.parallel([hit(), Animated.timing(tint, { toValue: 1, duration: 160, useNativeDriver }), rise(0.78, 190)]),
          fall(1, 190),
          Animated.parallel([hit(), Animated.timing(tint, { toValue: 2, duration: 140, useNativeDriver }), ring(ring1, 0), ring(ring2, 120)]),
        ])
      : Animated.sequence([
          Animated.delay(40),
          fall(1, 240),
          Animated.parallel([hit(), ring(ring1, 0)]),
        ]);

    const all = Animated.parallel([
      ...(full ? layer.map((v, i) => spring(v, i * 70)) : []),
      full ? Animated.spring(bowlIn, { toValue: 1, delay: 150, speed: 12, bounciness: 8, useNativeDriver }) : Animated.delay(0),
      ball,
      Animated.timing(words, { toValue: 1, duration: 320, delay: full ? 950 : 160, useNativeDriver }),
    ]);
    all.start(finish);
    return () => all.stop();
    // The splash plays once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dropDistance = full ? 240 : 70;
  const circleY = drop.interpolate({ inputRange: [0, 1], outputRange: [-dropDistance, 0] });
  const circleScaleX = squash.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
  const circleScaleY = squash.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] });
  const circleTransform = [{ translateY: circleY }, { scaleX: circleScaleX }, { scaleY: circleScaleY }];
  const circleOpacity = drop.interpolate({ inputRange: [0, 0.15], outputRange: [0, 1], extrapolate: 'clamp' });
  const tintOpacity = (stop: number) =>
    tint.interpolate({ inputRange: [stop - 1, stop, stop + 1], outputRange: [0, 1, 0], extrapolate: 'clamp' });
  const ringStyle = (v: Animated.Value) => ({
    opacity: v.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.8, 0] }),
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.6] }) }],
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.root, { opacity: fadeOut }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={firstName ? `Cuidance. Welcome back, ${firstName}` : 'Cuidance. Welcome back'}
    >
      <Image source={GRAIN} style={[styles.grain, { width, height: ART_H * scale }]} resizeMode="stretch" />
      {LAYERS.map((l, i) => (
        <Animated.Image
          key={l.key}
          source={art[l.key]}
          style={{
            position: 'absolute',
            left: l.x * scale,
            bottom: (ART_H - (l.y + l.h)) * scale,
            width: l.w * scale,
            height: l.h * scale,
            transform: [{ translateY: layer[i].interpolate({ inputRange: [0, 1], outputRange: [0, 320] }) }],
          }}
        />
      ))}

      <View style={styles.center} pointerEvents="none">
        <View style={styles.mark}>
          <Animated.View style={[styles.ring, ringStyle(ring1), { borderColor: c.brand }]} />
          <Animated.View style={[styles.ring, ringStyle(ring2), { borderColor: c.brand }]} />
          <Animated.Image
            source={art.bowl}
            style={[
              styles.bowl,
              {
                opacity: bowlIn,
                transform: [{ translateY: bowlIn.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
              },
            ]}
          />
          <Animated.View style={[styles.circle, { opacity: circleOpacity, transform: circleTransform }]}>
            <Animated.Image source={art.circle} style={[styles.fill, { tintColor: g.terracottaBold, opacity: tintOpacity(0) }]} />
            <Animated.Image source={art.circle} style={[styles.fill, { tintColor: c.accent, opacity: tintOpacity(1) }]} />
            <Animated.Image source={art.circle} style={[styles.fill, { opacity: tintOpacity(2) }]} />
          </Animated.View>
        </View>
        <Animated.Image
          source={art.word}
          style={[styles.word, { opacity: words, transform: [{ translateY: words.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}
        />
        <Animated.Text style={[styles.hello, { opacity: words }]}>
          {firstName ? (
            <>
              Welcome back, <Text style={styles.name}>{firstName}</Text>
            </>
          ) : (
            'Welcome back'
          )}
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const useStyles = makeStyles((c) =>
  StyleSheet.create({
    root: {
      backgroundColor: c.surfaceWarm,
      overflow: 'hidden',
      zIndex: 10,
    },
    grain: {
      position: 'absolute',
      left: 0,
      bottom: 0,
    },
    center: {
      position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
      alignItems: 'center',
      paddingTop: '30%',
      gap: space[16],
    },
    mark: {
      width: BOWL.width,
      height: BOWL.top + BOWL.height,
    },
    ring: {
      position: 'absolute',
      left: BOWL.width / 2 - 60,
      top: (BOWL.top + BOWL.height) / 2 - 60,
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
    },
    bowl: {
      position: 'absolute',
      ...BOWL,
    },
    circle: {
      position: 'absolute',
      ...CIRCLE,
    },
    fill: {
      position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
      width: CIRCLE.width,
      height: CIRCLE.height,
    },
    word: {
      ...WORD,
      marginTop: space[8],
    },
    hello: {
      ...type.body,
      color: c.ink,
      textAlign: 'center',
    },
    name: {
      fontFamily: fontFamily.display,
    },
  }),
);
