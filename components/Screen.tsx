import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { layout, space, stroke } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

type ScreenProps = {
  children: ReactNode;
  centered?: boolean;
  // Pinned under the scrolling content, so actions like Next question are always in reach
  footer?: ReactNode;
  // Tighter spacing for screens meant to fit in one view, like quiz questions
  compact?: boolean;
  // The line above the footer. The quiz hi-fi has none
  footerDivider?: boolean;
  // Replaces the page color. Only the Welcome screen uses it, for Grounded Green in dark mode
  background?: string;
};

export function Screen({ children, centered = false, footer, compact = false, footerDivider = true, background }: ScreenProps) {
  const styles = useStyles();
  return (
    <SafeAreaView style={[styles.safe, background ? { backgroundColor: background } : null]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.content, compact && styles.compact, centered && styles.centered]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {footer ? <View style={[styles.footer, !footerDivider && styles.footerNoDivider]}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  footerNoDivider: {
    borderTopWidth: 0,
  },
  safe: {
    flex: 1,
    backgroundColor: c.background,
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
    borderTopColor: c.border,
    backgroundColor: c.background,
  },
}));
