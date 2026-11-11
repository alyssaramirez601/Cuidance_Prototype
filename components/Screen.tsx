import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, space, stroke } from '@/constants/tokens';

type ScreenProps = {
  children: ReactNode;
  centered?: boolean;
  // Pinned under the scrolling content, so actions like Next question are always in reach
  footer?: ReactNode;
  // Tighter spacing for screens meant to fit in one view, like quiz questions
  compact?: boolean;
};

export function Screen({ children, centered = false, footer, compact = false }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.content, compact && styles.compact, centered && styles.centered]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: layout.screenEdge,
    paddingVertical: space[24],
    gap: space[16],
  },
  compact: {
    paddingVertical: space[8],
    gap: space[8],
  },
  centered: {
    justifyContent: 'center',
  },
  footer: {
    gap: space[8],
    paddingHorizontal: layout.screenEdge,
    paddingVertical: space[8],
    borderTopWidth: stroke.default,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
});
