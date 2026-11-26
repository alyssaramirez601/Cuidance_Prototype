import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius, stroke } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

type ArtFrameProps = {
  source: number;
  // `cover` fills the frame (full scene art); `contain` sits art with its own edges inside it
  fit?: 'cover' | 'contain';
  // `arch` gives the frame the brand's arch top
  shape?: 'rounded' | 'arch';
  style?: StyleProp<ViewStyle>;
};

// Most library art exists in a light version only. Instead of a bright cream square floating on a
// dark page, it always sits in a Warm Care frame with a thin edge, so it reads as a framed print in
// both modes. Decorative: hidden from screen readers. Size it with `style` (width and aspectRatio)
export function ArtFrame({ source, fit = 'cover', shape = 'rounded', style }: ArtFrameProps) {
  const styles = useStyles();
  return (
    <View style={[styles.frame, shape === 'arch' && styles.arch, style]} accessible={false}>
      <Image source={source} style={fit === 'cover' ? StyleSheet.absoluteFill : styles.contain} contentFit={fit} accessible={false} />
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  frame: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surfaceWarm,
  },
  arch: {
    borderTopLeftRadius: radius.pill,
    borderTopRightRadius: radius.pill,
  },
  contain: {
    width: '85%',
    height: '85%',
  },
}));
