import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, layout, radius, sizes, space, type } from '@/constants/tokens';

type NoteProps = {
  text: string;
};

const c = colors.light;

// A calm supporting note in Warm Care, like "Pick as many as you like" on the quiz.
// CuiNote in the Week 8 component kit. Not in docs/design-system/components.md yet, so Esme should add it
export function Note({ text }: NoteProps) {
  return (
    <View style={styles.note}>
      <Icon name="info" size={sizes.icon.large} color={c.ink} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.surfaceWarm,
  },
  text: {
    ...type.caption,
    flex: 1,
    color: c.ink,
  },
});
