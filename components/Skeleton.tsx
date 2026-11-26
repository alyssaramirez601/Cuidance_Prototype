import { StyleSheet, View, type DimensionValue } from 'react-native';

import { radius } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

type SkeletonProps = {
  height: number;
  width?: DimensionValue;
  shape?: 'small' | 'medium' | 'pill';
};

// A quiet placeholder block shaped like the content that is loading. It never moves, so it needs
// nothing for Reduce Motion. The screen around it carries the "Loading" label for screen readers
export function Skeleton({ height, width = '100%', shape = 'medium' }: SkeletonProps) {
  const styles = useStyles();
  return <View style={[styles.block, { height, width, borderRadius: radius[shape] }]} accessible={false} />;
}

const useStyles = makeStyles((c) => StyleSheet.create({
  block: {
    backgroundColor: c.disabledSurface,
  },
}));
