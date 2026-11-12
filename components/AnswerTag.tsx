import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, stroke, type } from '@/constants/tokens';

type AnswerTagProps = {
  label: string;
};

const c = colors.light;

// A read-only answer, like "Shiny in some areas" on the result. "Answer Tag" in the Week 8
// Step 4 component kit. Not in docs/design-system/components.md yet, so Esme should add it
export function AnswerTag({ label }: AnswerTagProps) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    paddingVertical: space[8],
    paddingHorizontal: space[12],
    borderRadius: radius.small,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  text: {
    ...type.caption,
    color: c.ink,
  },
});
