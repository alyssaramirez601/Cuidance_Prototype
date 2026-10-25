import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, layout, radius, sizes, space, stroke, type } from '@/constants/tokens';

export type HelpButtonState = 'default' | 'pressed';

type HelpButtonProps = {
  onPress: () => void;
  // Leave out to follow the real press. Set it to pin a state, for example on the dev screen
  state?: HelpButtonState;
};

const c = colors.light;

export function HelpButton({ onPress, state }: HelpButtonProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Help" style={styles.hug}>
      {({ pressed }) => {
        const current: HelpButtonState = state ?? (pressed ? 'pressed' : 'default');
        return (
          <View style={[styles.button, { backgroundColor: current === 'pressed' ? c.border : c.surface }]}>
            <Icon name="help" size={sizes.icon.medium} color={c.ink} />
            <Text style={styles.label}>Help</Text>
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Hugs its content in any parent, so it never stretches full width
  hug: {
    alignSelf: 'flex-start',
  },
  button: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    paddingVertical: space[8],
    paddingHorizontal: space[12],
    borderRadius: radius.pill,
    borderWidth: stroke.default,
    borderColor: c.borderStrong,
  },
  label: {
    ...type.label,
    color: c.ink,
  },
});
