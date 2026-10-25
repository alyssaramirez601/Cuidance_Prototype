import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { colors, layout, radius, space, stroke, type } from '@/constants/tokens';

type HelpPanelProps = {
  title: string;
  body: string;
  buttonLabel: string;
  onButtonPress: () => void;
  onClose: () => void;
};

// The panel itself. The screen decides how it slides in, and what the help copy says
export function HelpPanel({ title, body, buttonLabel, onButtonPress, onClose }: HelpPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.body}>{body}</Text>
      <Button style="secondary" label={buttonLabel} onPress={onButtonPress} />
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={styles.close}>
        <Text style={styles.closeLabel}>Close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: space[16],
    padding: space[24],
    borderTopLeftRadius: radius.medium,
    borderTopRightRadius: radius.medium,
    borderTopWidth: stroke.default,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  title: {
    ...type.heading,
    color: colors.light.ink,
  },
  body: {
    ...type.body,
    color: colors.light.ink,
  },
  close: {
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: {
    ...type.label,
    color: colors.light.accent,
  },
});
