import type { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, layout, stroke } from '@/constants/tokens';

type WebFrameProps = {
  children: ReactNode;
};

// On a wide browser window the app sits in a phone-width column. On phones it renders as is.
export function WebFrame({ children }: WebFrameProps) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.backdrop}>
      <View style={styles.column}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.light.surfaceWarm,
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: layout.webMaxWidth,
    backgroundColor: colors.light.background,
    borderColor: colors.light.border,
    borderLeftWidth: stroke.default,
    borderRightWidth: stroke.default,
  },
});
