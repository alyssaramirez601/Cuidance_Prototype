import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, layout, radius, sizes, space, type } from '@/constants/tokens';

type SheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

const c = colors.light;

// The one bottom sheet for the app (CLAUDE.md: Privacy & Trust, Save confirmation, Routine detail, and result details).
// Not in the Figma design system yet, so Esme should add it there
export function Sheet({ visible, title, onClose, children }: SheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* Tapping the dimmed area also closes it, for people who reach for outside the sheet */}
        <Pressable style={styles.dismissArea} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">
              {title}
            </Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={styles.close}>
              <Icon name="close" size={sizes.icon.large} color={c.ink} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: c.scrim,
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    maxHeight: '85%',
    borderTopLeftRadius: radius.medium,
    borderTopRightRadius: radius.medium,
    backgroundColor: c.background,
    paddingBottom: space[32],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[12],
    paddingTop: space[24],
    paddingHorizontal: layout.screenEdge,
  },
  title: {
    ...type.title,
    flex: 1,
    color: c.ink,
  },
  close: {
    minWidth: layout.minTouchTarget,
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: c.surface,
  },
  body: {
    gap: space[16],
    paddingTop: space[16],
    paddingHorizontal: layout.screenEdge,
  },
});
