import type { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { layout, stroke } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

type WebFrameProps = {
  children: ReactNode;
};

// On a wide browser window the app sits in a phone-width column. On phones it renders as is.
export function WebFrame({ children }: WebFrameProps) {
  const styles = useStyles();
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.backdrop}>
      <View style={styles.column}>{children}</View>
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: c.surfaceWarm,
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: layout.webMaxWidth,
    backgroundColor: c.background,
    borderColor: c.border,
    borderLeftWidth: stroke.default,
    borderRightWidth: stroke.default,
  },
}));
