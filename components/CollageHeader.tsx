import { Image, type ImageSource } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Appear } from '@/components/Appear';
import { colors, layout, radius, space, type } from '@/constants/tokens';
import { makeStyles, useTheme } from '@/hooks/useTheme';

export type CollageVariant = 'explore' | 'saved' | 'shop' | 'profile';

type CollageHeaderProps = {
  title: string;
  intro?: string;
  variant: CollageVariant;
  // A picture in an arch window on the right (Profile uses its banner art)
  art?: ImageSource | number;
  children?: ReactNode;
};

const GRAIN = require('@/assets/splash/grain.png');
const SIZE = space[48];

// Direction A "Sunlit Collage" for the tab pages (Nov 25 canvas): each page gets its own color block
// with cut-paper shapes that cast soft shadows, plus print grain, so the top has depth instead of a flat fill.
// Shapes are decoration only and stay behind and to the right of the text
export function CollageHeader({ title, intro, variant, art, children }: CollageHeaderProps) {
  const styles = useStyles();
  const { scheme } = useTheme();
  const block = blockFor(variant, scheme);
  const ink = block.inkLight ? colors.light.onBrand : colors.light.ink;
  const shapes = useShapes(variant);

  return (
    <Appear style={[styles.header, { backgroundColor: block.fill }]}>
      {shapes.map((shape, i) => (
        <View key={i} style={[styles.shape, shape]} />
      ))}
      {art ? (
        <View style={styles.artWindow}>
          <Image source={art} style={styles.art} contentFit="cover" accessible={false} />
        </View>
      ) : null}
      <Image source={GRAIN} style={styles.grain} contentFit="cover" accessible={false} />

      <View style={styles.text}>
        <Text style={[styles.title, { color: ink }]} accessibilityRole="header">
          {title}
        </Text>
        {intro ? <Text style={[styles.intro, { color: ink }]}>{intro}</Text> : null}
      </View>
      {children}
    </Appear>
  );
}

// Light mode: bold blocks get light text, pale blocks get Guidance Ink. Dark mode: every block is deep,
// with light text. All pairs are 7:1 or more
function blockFor(variant: CollageVariant, scheme: 'light' | 'dark') {
  const light = {
    explore: { fill: '#2E4A3A', inkLight: true }, // greenBold
    saved: { fill: '#152B91', inkLight: true }, // blueBold
    shop: { fill: '#F2A65E', inkLight: false }, // orange
    profile: { fill: '#D6DFB7', inkLight: false }, // olive
  };
  const dark = {
    explore: { fill: '#2E4A3A', inkLight: true },
    saved: { fill: '#1E2650', inkLight: true },
    shop: { fill: '#7C3A08', inkLight: true },
    profile: { fill: '#424D2C', inkLight: true },
  };
  return (scheme === 'dark' ? dark : light)[variant];
}

function useShapes(variant: CollageVariant): ViewStyle[] {
  const { g, scheme } = useTheme();
  const dark = scheme === 'dark';
  const circle = (d: number, color: string, pos: ViewStyle): ViewStyle => ({
    width: d, height: d, borderRadius: radius.pill, backgroundColor: color, ...pos,
  });
  const arch = (w: number, h: number, color: string, pos: ViewStyle): ViewStyle => ({
    width: w, height: h, borderTopLeftRadius: w / 2, borderTopRightRadius: w / 2, backgroundColor: color, ...pos,
  });
  // Bookmark ribbons hang from the top edge on Saved
  const ribbon = (w: number, h: number, color: string, pos: ViewStyle): ViewStyle => ({
    width: w, height: h, borderBottomLeftRadius: w / 2, borderBottomRightRadius: w / 2, backgroundColor: color, ...pos,
  });
  const shapes: Record<CollageVariant, ViewStyle[]> = {
    explore: [
      circle(SIZE * 3.5, g.orange, { right: -SIZE * 0.75, top: -SIZE }),
      arch(SIZE * 2.2, SIZE * 3.2, g.olive, { right: SIZE * 1.3, bottom: -SIZE * 1.2 }),
      arch(SIZE * 1.8, SIZE * 2.6, g.clay, { right: SIZE * 0.1, bottom: -SIZE }),
    ],
    saved: [
      circle(SIZE * 2.75, dark ? '#2A3570' : g.waveBlue, { right: SIZE * 1.6, bottom: -SIZE * 1.7 }),
      ribbon(SIZE * 1.3, SIZE * 3.2, g.clay, { right: SIZE * 0.9, top: -SIZE * 0.5 }),
      ribbon(SIZE * 1.15, SIZE * 2.5, g.orange, { right: -SIZE * 0.2, top: -SIZE * 0.25 }),
    ],
    shop: [
      circle(SIZE * 3.1, dark ? g.terracotta : g.terracottaBold, { right: -SIZE * 0.6, top: SIZE * 0.6 }),
      arch(SIZE * 2.3, SIZE * 3.1, dark ? '#21332B' : '#2E4A3A', { right: SIZE * 1.9, bottom: -SIZE * 0.8 }),
      arch(SIZE * 1.7, SIZE * 2.3, g.paper, { right: SIZE * 0.4, bottom: -SIZE * 0.8 }),
    ],
    profile: [circle(SIZE * 2.3, g.orange, { right: SIZE * 3.1, bottom: -SIZE })],
  };
  return shapes[variant];
}

const useStyles = makeStyles((_c, g) =>
  StyleSheet.create({
    header: {
      marginHorizontal: -layout.screenEdge,
      marginTop: -space[24],
      marginBottom: space[8],
      minHeight: SIZE * 4,
      paddingHorizontal: layout.screenEdge,
      paddingTop: space[32],
      paddingBottom: space[32],
      gap: space[8],
      borderBottomRightRadius: SIZE * 3,
      overflow: 'hidden',
      boxShadow: g.shadowShape,
    },
    shape: {
      position: 'absolute',
      boxShadow: g.shadowShape,
    },
    artWindow: {
      position: 'absolute',
      right: space[16],
      top: space[24],
      width: SIZE * 3,
      height: SIZE * 3.9,
      borderTopLeftRadius: SIZE * 1.5,
      borderTopRightRadius: SIZE * 1.5,
      borderBottomLeftRadius: radius.medium,
      borderBottomRightRadius: radius.medium,
      borderWidth: space[4] + 2,
      borderColor: g.paper,
      overflow: 'hidden',
      boxShadow: g.shadowShape,
    },
    art: {
      flex: 1,
    },
    grain: {
      position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
      opacity: 0.9,
    },
    // Text keeps to the left so the shapes never sit behind it
    text: {
      maxWidth: '55%',
      gap: space[8],
    },
    title: {
      ...type.display,
    },
    intro: {
      ...type.body,
    },
  }),
);
