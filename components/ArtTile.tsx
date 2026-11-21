import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { radius, space } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

// A small illustration in place of a line icon at the start of a list row, like Esme's Week 12 art
export function ArtTile({ art }: { art: ImageSource | number }) {
  const styles = useStyles();
  return (
    <View style={styles.tile}>
      <Image source={art} style={styles.image} contentFit="contain" accessible={false} />
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  tile: {
    width: space[48],
    height: space[48],
    borderRadius: radius.small,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.background,
  },
  image: {
    width: space[48] - space[4],
    height: space[48] - space[4],
  },
}));
