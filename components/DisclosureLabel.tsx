import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, sizes, space, stroke, type } from '@/constants/tokens';

export type DisclosureLabelType = 'partner' | 'sponsored';

type DisclosureLabelProps = {
  type: DisclosureLabelType;
};

const text = {
  partner: 'Partner content',
  sponsored: 'Sponsored',
} as const;

// Partner and sponsored content is always labeled and kept separate from guidance
export function DisclosureLabel({ type: labelType }: DisclosureLabelProps) {
  return (
    <View style={styles.label} accessible accessibilityLabel={text[labelType]}>
      <Text style={styles.text}>{text[labelType]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    minHeight: sizes.disclosureLabelHeight,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingVertical: space[4],
    paddingHorizontal: space[8],
    borderRadius: radius.small,
    borderWidth: stroke.default,
    borderColor: colors.light.partner,
    backgroundColor: colors.light.partnerSurface,
  },
  text: {
    ...type.caption,
    color: colors.light.partner,
  },
});
